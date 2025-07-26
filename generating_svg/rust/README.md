
# Generating SVGs with Rust

*Contributed by [Lukas Hermann](https://lukashermann.com/)*

#### 1. Install Rust and Cargo

* Install [rustup](https://www.rust-lang.org/tools/install). This will install the *rustc* compiler, as well as `cargo`, which is how you will actually run this project.

#### 2. Run the sketch

* At the command line in the root of the rust project (i.e. the location of `cargo.toml` & `src/`), run:
```sh
cargo run --release
```
* The `--release` flag is optional, but the binary will run a little faster since it would be building in production mode.
* Now the generated SVG file should appear in the root of the project.

---

### Lissajous Demo in Rust

* Code is in [src/main.rs](src/main.rs)
* Review [Cargo.toml](Cargo.toml) to see the svg dependency


```rust

// Look at the Cargo.toml to see the svg dependency
use svg::node::element::path::Data;
use svg::node::element::Path;
use svg::Document;

// port of Processing's map function
fn map(val: f32, low1: f32, high1: f32, low2: f32, high2: f32) -> f32 {
    low2 + (val - low1) * (high2 - low2) / (high1 - low1)
}

fn main() {
    let width = 1056;
    let height = 816;

    let n_points = 100;
    let cx = (width as f32) / 2.0;
    let cy = (height as f32) / 2.0;
    let radius = (width as f32) / 4.0;

    // create the data that goes in the "d" of an SVG <path> element
    // we assign it as mutable because the mutator methods return Self;
    let mut data = Data::new();

    for i in 0..=n_points {
        // using map in order to be more like the processing example
        // the following line would have been just fine (same as the canvas-sketch example)
        // let theta = std::f32::consts::TAU * (i as f32) / (n_points as f32);
        let theta = map(i as f32, 0.0, n_points as f32, 0.0, std::f32::consts::TAU);

        // sin and cos in rust are a little strange if you're coming from JS or processing
        let px = cx + radius * f32::from(theta * 2.0).sin();
        let py = cy + radius * f32::from(theta * 3.0).cos();

        // start lines after first point origin is set
        if i > 0 {
            data = data.line_to((px, py));
        }
        data = data.move_to((px, py));
    }
    data = data.close();

    // create the actual path element to go in the svg
    let path = Path::new()
        .set("fill", "none")
        .set("stroke", "black")
        .set("stroke-width", 3)
        .set("d", data);

    // create a new SVG document that we can save
    let document = Document::new()
        .set("width", width)
        .set("height", height)
        .set("viewBox", (0, 0, width, height))
        .add(path);

    // save takes a reference to a Document, so we borrow here
    svg::save("lissajous-from-rust.svg", &document).unwrap();
}

```