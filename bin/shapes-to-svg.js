const fs = require('fs')

function run() {
    readFile()
}

function readFile() {
    try {
        const rawdata = fs.readFileSync('./data/glacial_lake_deposit_csspolygon.txt')
        // const rawdata = fs.readFileSync('./data/trap_rock_valley_csspolygon.txt')
        // const rawdata = fs.readFileSync('./data/marble_valley_csspolygon.txt')
        const polys = rawdata.toString().split('\n')
        // marble
        // const svg_open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 404.82 1010.52">'
        // traprock
        // const svg_open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 573.51 1016.13">'
        // glacial
        const svg_open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1247.39 998.86">'
        const output_file = './data/glacial_lake_deposit_polys.svg'

        let master_shapes = []

        polys.forEach( (element) => {
            let cleaned = element.replace('polygon(', '')
            cleaned = cleaned.replace(')', '')

            let all_coords = cleaned.split(', ')
            const current_poly_coords = all_coords.map( x => {
                return x.split(' ').join(',')
            })

            master_shapes.push(current_poly_coords)
        })

        let output = svg_open
        master_shapes.forEach( (element) => {
            output += `<polygon stroke="black" fill="purple" points="${element.join(' ')}" />`
        })
        output += '</svg>'
        // <polygon stroke="black" fill="none" points="50,0 21,90 98,35 2,35 79,90" />

        fs.writeFileSync(output_file, output)
    } catch(e) {
        console.log(e)
    }
    

}

run()