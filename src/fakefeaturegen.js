function FakeFeatureGen () {

    function generate () {
        return {
            hue: Math.random()*100,
            contrast: Math.random()*100,
            brightness: Math.random()*100,
            rgb: {
                red: Math.random()*100,
                green: Math.random()*100,
                blue: Math.random()*100
            }
        }
    }

    return {
        generate: generate
    }
}