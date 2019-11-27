#### getBalanceRequest
Action: get wallet balance with `getbalance` pastel command

Returns: `getBalanceResponse`
```javascript
{
    status: "OK",
    balance: 123
}
```

```javascript
{
    status: "ERROR",
    msg: "Error text"
}
```

#### sendPSLRequest
Arguments:
```javascript
{
    address: "tPiCk5DCt4fd9pRAHGXHUmUK9eRkY46k5NA",
    amount: 123.22
}
```

Action: sends given amount to a given wallet

Returns: `sendPSLResponse`
```javascript
{
    status: "OK",
    msg: "Funds succesfully sent"
}
```

```javascript
{
    status: "ERROR",
    msg: "Error text"
}
```

#### blockchainDataRequest
Action: sends given amount to a given wallet

Returns: `blockchainDataResponse`
```javascript
{
    status: "OK",
    address: "tPiCk5DCt4fd9pRAHGXHUmUK9eRkY46k5NA"
}
```

Returns: `walletAddress`
```javascript
'Cannot connect to local pasteld!, command: getaccountaddress'
```

