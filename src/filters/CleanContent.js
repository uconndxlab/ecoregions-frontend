import Vue from 'vue'

Vue.filter('cleanContent', function(val) {
    if ( !val ) {
        return ''
    }
    val = val.toString()
    let new_val = val.replaceAll("\r\n\r\n", "</p><p>")
    if ( new_val !== val ) {
        new_val = "<p>" + new_val + "</p>"
        return new_val
    } else {
        if ( val.includes('<p>') && val.includes('</p>') ) {
            return val
        } 
    }
    return "<p>" + val + "</p>"
})