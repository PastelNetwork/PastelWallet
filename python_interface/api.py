import zerorpc
import os
from PastelCommon.keys import id_keypair_generation_func


class Api:
    def generate_keys(self):
        # TODO: support custom path for keys, proccess different errors (file already
        # TOOD: exists, no access to file, etc..
        __privkey, __pubkey = id_keypair_generation_func()
        privpath = 'private.key'
        pubpath = 'public.key'
        with open(privpath, "wb") as f:
            f.write(__privkey)
        os.chmod(privpath, 0o0700)
        with open(pubpath, "wb") as f:
            f.write(__pubkey)
        os.chmod(pubpath, 0o0700)
        return 'Generated'


def main():
    addr = 'tcp://127.0.0.1:4242'
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()
