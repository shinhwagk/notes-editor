```go
// return func
func makeFunction(name string) func() {
	return func() {
		fmt.Printf("Hello %s", name)
	}
}
```