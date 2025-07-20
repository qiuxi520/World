var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var meteors = []
var stars = 1

function newmeteor()
{
    meteors.push({
        lines: [{
            x: parseInt(Math.random() * canvas.width),
            y: parseInt(Math.random() * canvas.height*0.3)
        }],
        life: parseInt(Math.random() * 500) + 200,
        age: 0
    })
}

function init()
{
    for (var i = 0; i < stars; i++) {
        newmeteor()
    }
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < meteors.length; i++)
    {
        meteor = meteors[i]
        lines = meteor.lines
        for (var j = 0; j < lines.length; j++)
        {
            ctx.fillStyle = "rgb(255,255,255," + j / lines.length + ")"
            ctx.fillRect(lines[j].x, lines[j].y, 1, 1)
        }

        ctx.fillStyle = "yellow"
        var star = lines[lines.length - 1]
        ctx.fillRect(star.x, star.y, 2, 2)

        // 前半生：向后增长
        if (meteor.age <= meteor.life / 2)
        {
            lines.push({
                x: star.x + 1,
                y: star.y + 0.3
            })
        }
        else
        {
            lines.shift() // 后半生：移除旧点（尾部缩短）
        }

        meteor.age++
        if (meteor.age >= meteor.life)
        {
            meteors.splice(i, 1)
            newmeteor()
        }
    }
}

init()
setInterval(draw, 3)
