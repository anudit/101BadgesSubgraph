# 101.xyz badges

Build completed: QmVB6ejSw2cVcunRyJw6M6KpDS98L85nmW6LYYhVzNT4WH

Deployed to https://thegraph.com/explorer/subgraph/anudit/101badges

Subgraph endpoints:
Queries (HTTP):     https://api.thegraph.com/subgraphs/name/anudit/101badges
Subscriptions (WS): wss://api.thegraph.com/subgraphs/name/anudit/101badges


## Examples

### Get Passes
```
{
  badges(first: 5) {
    owner {
      id
    }
    tokenId
    tokenURI
    metadata {
      name
      description
      image
      tags
      external_id
    }
  }
}
```
