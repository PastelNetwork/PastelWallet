#include <iostream>
#include <unistd.h>

int main() {
    int a = 0;
    while (true) {
        std::cerr << "iteration number " << a << std::endl;
        a++;
        sleep(2);
    }
    return 0;
}
