function x() {
    try {
        return 1
    } catch (e) {
        console.log("S")
    } finally {
        console.log("f")
    }
}


console.log(x())