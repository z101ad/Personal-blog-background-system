export default function(time){
    const date = new Date(+time)
    let year = date.getFullYear()
    let month = (date.getMonth()+1).toString().padStart(2,'0')
    let day = date.getDate().toString().padStart(2,'0')
    let hour = date.getHours().toString().padStart(2,'0')
    let minute = date.getMinutes().toString().padStart(2,'0')
    let second = date.getSeconds().toString().padStart(2,'0')
    let index = date.getDay()
    let arr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
    return`${year}-${month}-${day} ${hour}:${minute}:${second} ${arr[index]}`

}