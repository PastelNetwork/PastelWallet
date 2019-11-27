#### imageRegFormSubmit
Arguments:
```javascript
{
    artName: 'art name',
    numCopies: 0,
    copyPrice: 0,
    filePath: '/path/to/image/file'
}
```

Actions:
 - Get network fee
 - Get user's balance, check if it's sufficient
 - Return fee
 - Or return error

Returns: `imageRegFormSubmitResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    msg: 'OK',
    regFee
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    msg: `Not enough funds to pay fee (need PSL${regFee}`,
    regFee
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    msg: `msg`
}
```




#### imageRegFormCancel
Arguments:
```javascript
{regticketId: id}
```

Action: removes given regticket from the local DB

Returns: `imageRegFormCancelResponse`
```javascript
{
    status: RESPONSE_STATUS_OK
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR
}
```

#### imageRegFormProceed
Arguments:
```javascript
{
    image: <image file path>,
    title: <image name>
}
```

Actions:
 - Sends data to the wallet api to obtain fee from the masternode.
 - Check user's balance

Returns: `imageRegFormProceedResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    fee,
    regticket_id
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    msg: `Not enough funds to pay fee (need PSL${fee})`,
    fee
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    msg: `Not enough funds to pay fee (need PSL${fee})`
}
```

#### imageRegFormStep3
Arguments:
```javascript
{
    regticketId: this.props.regticketId
}
```

Action: initiates final stage of registration process. Call `wallet_api` .
On success - creates activation ticket using cNode API.


Returns: `imageRegFormStep3Response`
```javascript
{
    status: RESPONSE_STATUS_OK,
    txid: response.data.txid
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    msg: err.response.data
}
```

Returns: `imageRegFormActTicketCreated`
```javascript
{
    status: RESPONSE_STATUS_OK,
    txid: response.data.result.txid
}
```
