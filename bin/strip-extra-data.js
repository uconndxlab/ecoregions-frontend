const fs = require('fs')

function run() {
    readFile()
}

function readFile() {
    try {
        const rawdata = fs.readFileSync('./data/fixed.json')
        let data = JSON.parse(rawdata)
        for ( let i = 0; i < data.features.length; i++ ) {
            delete data.features[i].properties['Towns']
            delete data.features[i].properties['Students']
            delete data.features[i].properties['Faculty/Staff']
            delete data.features[i].properties['Alumni']
            delete data.features[i].properties['Financial Aid - Average Institutional Aid']
            delete data.features[i].properties['Financial Aid - Average Roberta Willis Scholarship']
            delete data.features[i].properties['UCHC Patient Visits']
            delete data.features[i].properties['UConn Health Research Amount']
        }
        let cleanData = JSON.stringify(data)
        fs.writeFileSync('./data/fixed-clean.json', cleanData)
    } catch(e) {
        console.log(e)
    }
    

}

run()