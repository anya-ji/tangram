window.addEventListener("load", function () {
    var t = new SVG(document.querySelector(".graph")).size("100%", 800)
      , elements = t.group().id("elements")
      , shapes = [
            elements.group()
          , elements.group()
          , elements.group()
          , elements.group()
          , elements.group()
          , elements.group()
          , elements.group()
        ]
      ;

    // 1. Big Triangle
    shapes[0].polygon("0,0 200,200 400,0").fill("#e74c3c");

    // 2. Big Triangle
    shapes[1].polygon("0,0 200,200 0,400").fill("#e67e22");

    // 3. Medium Triangle
    shapes[2].polygon("400,400 200,400 400,200").fill("#f1c40f");

    // 4. Small Triangle
    shapes[3].polygon("400,0 300,100 400,200").fill("#2ecc71");

    // 5. Small Triangle
    shapes[4].polygon("200,200 100,300 300,300").fill("#3498db");

    // 6. Square
    shapes[5].polygon("200,200 300,300 400,200 300,100").fill("#9b59b6");

    // 7. Parallelogram
    shapes[6].polygon("0,400 100,300 300,300 200,400").fill("#34495e");

    Crossy("polygon", "transformOrigin", "center");
    Crossy("polygon", "transition", "all 500 ease");
    shapes.forEach(function (c) {
        var moved = false;
        var angle = 0;
        var cPol = c.children()[0];
        c.draggy();
        c.on("dragmove", function () {
            moved = true;
        });
        cPol.on("mousedown", function () {
            moved = false;
        });
        cPol.on("mouseup", function () {
            if (!moved) {
                CSSRotate(this.node, (angle += 45));
            }
            moved = false;
        });
    });
});
