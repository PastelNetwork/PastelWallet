### Accessing cNode/PastelD API

There are 2 ways of accessing pasteld API. 
 - Using `pastel-cli` console client (on the same machine where `pasteld` is running)
 - Using HTTP JSON-RPC API. 
 
This 2 methods are quite similar - both accept a list of arguments, and result format is the same.

pastelid sign
-----------------

Parameters: Data to sign, PastelID, Passphrase
 
Example
 - `./pastel-cli pastelid sign data jXaQj8FA9FGP6KzKNKz9bPEX7owTWqF7CeQ2Vy1fT21pEMUeveqBf6DXhRv3o6mBN3AX5bBcTuvafDcepkZ3wp passphrase`     
Output:
```json
{
  "signature": "UoKzC6dGEQVzQi6+cfamDODLf+6wQy2QZSQXZp2k3AwG+3YSDWaTXf2ryt3fB/ygBNuTyspOaZwAgyP/t+WvTGtCFpNGpEiS+6Qsh1pQkrW7YCvuv0Uk9IE690fR+4kE5IaEzGnVyl8snns9Ob8zZzsA"
}
``` 
 
 pastelid verify
-----------------

Parameters: Signed data, Signature, PastelID of signer
 
Example
 - `./pastel-cli pastelid verify data <signature> <pastelID>`     
Output:
```json
{
  "verification": "OK"
}
``` 
or
```json
{
  "verification": "Failed"
}
``` 
