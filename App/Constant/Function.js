//String manipulator
//return "contoh text" -> "contoh text ..."
export function clipString(text, maxLength){
    if(text.length <= maxLength){
        return text
    }
    return text.substring(0, maxLength)+"...";
}