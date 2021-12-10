const fs = require('fs')

function run() {
    readFile()
}

function readFile() {
    try {
        const rawdata = fs.readFileSync('./data/marble_valley_pathstopoints.txt')
        const points = rawdata.toString().split('\n')
        const svg_open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 404.82 1010.52">'
        const output_file = './data/marble_valley_points.svg'

        let master_shapes = []
        let current_polygon = []
        points.forEach( (element) => {
            if ( element === '#' ) {
                // End or Start
                if ( current_polygon.length === 1 ) {
                    // Single point is not enough, just remove it.
                    current_polygon = []
                } else if ( current_polygon.length > 1 ) {
                    // Multi point polygon - save it and clear for the next
                    master_shapes.push( current_polygon )
                    current_polygon = []
                }
            } else {
                current_polygon.push(element)
            }
        });

        let output = svg_open
        master_shapes.forEach( (element) => {
            output += `<polygon stroke="black" fill="purple" points="${element.join(' ')}" />`
        });
        output += '</svg>'
        // <polygon stroke="black" fill="none" points="50,0 21,90 98,35 2,35 79,90" />

        fs.writeFileSync(output_file, output)
    } catch(e) {
        console.log(e)
    }
    

}

run()