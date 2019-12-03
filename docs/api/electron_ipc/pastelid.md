#### pastelIdList
Arguments: None

Actions:
 - Get list of pastel IDs from cNode
 - Get list of registered pastel IDs from cNode
 - Return list of pastel IDs with registered flag

Returns: `pastelIdListResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    data: [{
    PastelID: 'jXYfiNVv94S8ihzcryEtC5d7JKNt6pGmN1Jj9LUswfT9GDGX6SWdvPdKT3hTgvw4Y1YkjYo2AAUkGnnxpmREgY',
    isRegistered: true
    }]
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error message'
}
```

#### pastelIdCreate
Arguments:
```javascript
{
    passphrase: 'passphrase'
}
```

Actions:
 - Ask cNode to create new pastel ID using a given passphrase

Returns: `pastelIdCreateResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    data: 'jXYfiNVv94S8ihzcryEtC5d7JKNt6pGmN1Jj9LUswfT9GDGX6SWdvPdKT3hTgvw4Y1YkjYo2AAUkGnnxpmREgY'
}
```

```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error message'
}
```

#### pastelIdCreateAndRegister
Arguments:
```javascript
{
    passphrase: 'passphrase',
    blockchainAddress: '<blockchain address>'
}
```

Returns: `pastelIdCreateResponse`
```javascript
{
    status: RESPONSE_STATUS_OK
}
```

Returns: `pastelIdCreateResponse`
```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error message'
}
```

#### pastelIdRegister
Arguments:
```javascript
{
    pastelID: '',
    passphrase: '',
    blockchainAddress: ''
}
```

Returns: `pastelIdRegisterResponse`
```javascript
{
    status: RESPONSE_STATUS_OK
}
```

Returns: `pastelIdRegisterResponse`
```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error message'
}
```

#### pastelIdImport
Arguments:
```javascript
{
    passphrase: 'passphrase',
    key: 'pastelid'
}
```

Returns: `pastelIdImportResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    data
}
```

Returns: `pastelIdImportResponse`
```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error message'
}
```

#### pastelIdImportAndRegister
Arguments:
```javascript
{
    passphrase: 'passphrase',
    key: '',
    blockchainAddress: ''
}
```

Returns: `pastelIdCreateResponse`
```javascript
{
    status: RESPONSE_STATUS_OK
}
```

Returns: `pastelIdCreateResponse`
```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error_message'
}
```

#### pastelIdCheckPassphrase
Arguments:
```javascript
{
    passphrase: 'passphrase',
    pastelID: ''
}
```

Returns: `pastelIdCheckPassphraseResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    pastelID,
    passphrase
}
```

Returns: `pastelIdCheckPassphraseResponse`
```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error_message'
}
```

#### signMessage
Arguments:
```javascript
{
    passphrase: 'passphrase',
    pastelID: '',
    data,
    dataType
}
```

Returns: `signMessageResponse`
```javascript
{
    status: RESPONSE_STATUS_OK,
    signature,
    dataType,
    data
}
```

Returns: `signMessageResponse`
```javascript
{
    status: RESPONSE_STATUS_ERROR,
    err: 'error_message'
}
```
