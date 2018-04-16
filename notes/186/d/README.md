```go
type Point struct {
	X, Y int
}

var p Point

func main() {
	p = Point{
		X: 1,
		Y: 2,
	}

	fmt.Println(p.X)
}
```