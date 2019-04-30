import zerorpc
import os
import random
from PastelCommon.keys import id_keypair_generation_func
from PastelCommon.signatures import pastel_id_write_signature_on_data_func, \
    pastel_id_verify_signature_with_public_key_func

KEY_PATH = 'keys'


def generate_key_id():
    key_id = random.randint(10000, 99999)
    while os.path.exists(os.path.join(KEY_PATH, 'private_{}.key'.format(key_id))):
        key_id = random.randint(10000, 99999)
    return key_id


class Api:
    def generate_keys(self):
        # TODO: support custom path for keys, proccess different errors (file already
        # TOOD: exists, no access to file, etc..
        __privkey, __pubkey = id_keypair_generation_func()
        key_id = generate_key_id()
        privkey = 'private_{}.key'.format(key_id)
        pubkey = 'public_{}.key'.format(key_id)
        if not os.path.exists(KEY_PATH):
            os.mkdir(KEY_PATH)
        with open(os.path.join(KEY_PATH, privkey), "wb") as f:
            f.write(__privkey)
        os.chmod(os.path.join(KEY_PATH, privkey), 0o0700)
        with open(os.path.join(KEY_PATH, pubkey), "wb") as f:
            f.write(__pubkey)
        os.chmod(os.path.join(KEY_PATH, pubkey), 0o0700)
        return {
            'private': os.path.join(KEY_PATH, privkey),
            'public': os.path.join(KEY_PATH, pubkey)
        }

    def sign_message(self, msg):
        pass

    def verify_signature(self, msg, signature, public_key):
        pass


def main():
    addr = 'tcp://127.0.0.1:4242'
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()
