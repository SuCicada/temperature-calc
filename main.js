window.onload = () => {
    $("button[class*='mui-btn mui-btn-numbox-']")
        .bind("click", calc)
    $("input[type='number']")
        .bind("input propertychange onchange",
            calc)
    $("button[id='reset']")
        .click(() => {
            clearOutput()
            $("input[type='number']").each((i, n) => {
                n.value = 0
            })
        })
}

function clearOutput() {
    $("#output").html("")
}

function calc() {

    const math = Math
    const float = parseFloat
    const int = parseInt
    const print = (str, ...ss) => {
        output = document
            .getElementById("output")
        output.innerHTML = `${output.innerHTML}${str} ${ss.join(" ")}<br/>`
    }

    function input(id) {
        return document
            .getElementById(id)
            .value
    }

    function change_dn(s) {
        document.getElementById("dn").innerText = s
    }

    clearOutput()

// print("参数格式：换热量，热测温度1 ， 热测温度2 ， 冷测温度1 ， 冷测温度2");
// exit();
// q = float(sys.argv[1]);
// T1 = float(sys.argv[2]);
// T2 = float(sys.argv[3]);
// t1 = float(sys.argv[4]);
// t2 = float(sys.argv[5]);
// else:
// print("选型计算，输入参数：换热量，两侧温度");
    q = float(input("q"));
    T1 = float(input("ht1"));
    T2 = float(input("ht2"));
    t1 = float(input("ct1"));
    t2 = float(input("ct2"));
    // a = parseFloat(input("输入板型对应横截面积："));
    // dn1 = input("输入对应角孔：" + "(" + str(dn) + ")");
    // ln = parseInt(input("输入流道数量："));

    console.log(`
    换热量     ${q}
    热测温度1  ${T1}
    热测温度2  ${T2}
    冷测温度1  ${t1}
    冷测温度2  ${t2}
`)

    dt = 0;
    a = T1 - t2;
    b = T2 - t1;
    if (a === b) {
        dt = (a + b) / 2;
    } else if (a < b) {
        dt = (b - a) / math.log(b / a);
    } else {
        dt = (a - b) / math.log(a / b);
        dt = int(dt * 100) / 100;
        print("对数温差：", dt);
    }

// 计算流量
    dt1 = Math.abs(T1 - T2);
    dt2 = Math.abs(t1 - t2);
    p1 = q / dt1 / 4.18;
    p1_ = p1 * 3600 / 1000;
    p2 = q / dt2 / 4.18;
    p2_ = p2 * 3600 / 1000;

    p1 = parseInt(p1 * 100) / 100
    p2 = parseInt(p2 * 100) / 100

    print("流量(kg/s) A：", p1)
    print("流量(t/h) A：", p1 * 3600 / 1000);
    print("流量(kg/s) B：", p2);
    print("流量(t/h) B：", p2 * 3600 / 1000);

    pp = (() => {
        if (p1 > p2)
            return p1
        else
            return p2
    })()

    dn = Math.sqrt(pp / 3600 / 5 / 3.14) * 2 * 1000
    dn = parseInt(dn)

// # 判断对应的管径
    for (i of [32, 50, 100, 150, 200, 250, 300, 350, 400]) {
        if (dn < i) {
            dn = i;
            break
        }
    }
    change_dn(dn)
    dn1 = input("dn1");

    if (dn1 !== "") {
        dn = parseInt(dn1)
    }


    Va = p1_ / 3600 / (3.14 * (dn / 2) ** 2);
// # 热测角孔流速(m / s)
    Vb = p2_ / 3600 / (3.14 * (dn / 2) ** 2);
// # 冷测角孔流速(m / s)
    print("热测角孔流速", Va)
    print("冷测角孔流速", Vb)

    a = parseFloat(input("a"));
// # 单流道面积
    ln = parseInt(input("ln"));
// #单侧流道数
    s1 = p1 / 3600 / a / ln;
// # 板间流速(m / s)
    s2 = p2 / 3600 / a / ln;
    s1 = parseInt(s1 * 100) / 100;
    s2 = parseInt(s2 * 100) / 100;

    print("热测板间流速 （m/s)：", s1);
    print("冷测板间流速 （m/s)：", s2);
}
