//when admin sets problem and wants to fetch submission details from judge0, he must provide language id instead of language name
function getLanguageId(language){
    const lang = {
        "c++" : 105,
        "java" : 62,
        "javascript" : 102,
        "python" : 113
    }
    return lang[language.toLowerCase()];
}
module.exports = getLanguageId;