# Instructions

#### 1. Install Rust and Cargo

* Install [rustup](https://www.rust-lang.org/tools/install). This will install the rustc compiler, as well as `cargo`, which is how you will actually run this project.

#### 2. Run the sketch

* At the command line in the root of the rust project (i.e. the location of `cargo.toml` & `src/`), run:
```sh
cargo run --release
```
* The `--release` flag is optional, but the binary will run a little faster since it would be building in production mode.
* Now the SVG file should be in the root of the project.
