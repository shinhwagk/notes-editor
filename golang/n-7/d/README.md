```go
package main

import (
	"fmt"
)

func main() {

	ch := make(chan string)

	arr := [5]string{"ff", "xxx", "1", "x", "f"}

	for _, str := range arr {
		go aaa(str, ch)
	}

	for range arr {
		fmt.Println(<-ch)
	}
}

func aaa(str string, ch chan<- string) {
	ch <- str
}
```