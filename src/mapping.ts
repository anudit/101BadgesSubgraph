import {
  Contract,
  Transfer,
} from "../generated/Contract/Contract"
import { Metadata, Badge, User } from "../generated/schema"
import { ipfs, JSONValue,  json, JSONValueKind, BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {

  let user = User.load(event.params.to.toHexString())
  if (!user) {
    user = new User(event.params.to.toHexString())
  }

  let entity = Badge.load(event.params.tokenId.toString());
  if (entity === null) {
    entity = new Badge(event.params.tokenId.toString());
    user.badgesCnt = user.badgesCnt.plus(BigInt.fromI32(1));
  }

  user.save()

  entity.tokenId = event.params.tokenId;
  entity.owner = event.params.to.toHexString();
  entity.mintedOn = event.block.timestamp;
  entity.txnHash = event.transaction.hash;
  entity.badgeId =  "0x"+event.transaction.input.toHexString().slice(74, 74+64);

  const contract = Contract.bind(event.address);

  let tokenURI = contract.tokenURI(event.params.tokenId);
  entity.tokenURI = tokenURI;

  let hash = tokenURI.replaceAll('ipfs://', '');
  let data = ipfs.cat(hash);

  if (data) {
    entity.tokenURIRaw = data;

    let jsonData = json.fromBytes(data).toObject();
    if (jsonData) {

      const metaDataEntity = new Metadata(event.params.tokenId.toString());
      metaDataEntity.badgePointed = event.params.tokenId.toString();

      const name = jsonData.get("name");
      if (name) metaDataEntity.name = name.toString();

      const description = jsonData.get("description");
      if (description) metaDataEntity.description = description.toString();

      const image = jsonData.get("image");
      if (image) metaDataEntity.image = image.toString();

      const external_id = jsonData.get("external_id");
      if (external_id) {
        metaDataEntity.external_id = external_id.toString()
        metaDataEntity.external_url = `https://101.xyz/u/${event.params.to.toHexString()}/badge/${external_id.toString()}`;
      };

      let tags = jsonData.get("tags");
      if (tags) {
        let attrs = tags.toArray();
        let attrsParsed: string[] = [];

        for (let index = 0; index < attrs.length; index++) {
          let item = attrs[index].toString();
          attrsParsed.push(item);
        }

        metaDataEntity.tags = attrsParsed;
      }

      metaDataEntity.save();
    }

  };

  entity.save();
}
