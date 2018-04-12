```go
package main

import (
	"fmt"
)

func abc(a int) {
	defer func() {
		fmt.Println("xxxx")
	}()
	fmt.Println("f")
}

func main() {
	abc(1)
}
```