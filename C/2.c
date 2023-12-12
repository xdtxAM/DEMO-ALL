#include <stdio.h>

int main() {
    char c;
    printf("请输出一个字符");
    scanf("%c", &c);

    if ( (c>='a' && c<='z') || (c>='A' && c<='Z') )
        printf("%c是字母", c);
    else
        printf("%c不是字母", c);

    return 0;
}