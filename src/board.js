/* 场景：渲染器 / 灯光 / 木桌 / 深蓝垫 / Apple I 奶色主板 */
(function (LS8) {
  var M = {};

  function mesh(geo, mat, x, y, z, cast, receive) {
    var m = new THREE.Mesh(geo, mat);
    if (x !== undefined) m.position.set(x, y, z);
    m.castShadow = cast !== false;
    m.receiveShadow = receive !== false;
    return m;
  }

  function init() {
    var stage = document.getElementById("stage");
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var softGL = false;
    try {
      var gl = renderer.getContext();
      var ext = gl.getExtension("WEBGL_debug_renderer_info");
      var gpu = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "";
      softGL = /swiftshader|software|basic render/i.test(String(gpu));
    } catch (e) { /* 默认 */ }
    renderer.setPixelRatio(softGL ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = softGL ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.physicallyCorrectLights = true;
    stage.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    scene.background = LS8.Textures.sky({
      stops: ["#f8e3e0", "#f6ecdb", "#e3e8ef", "#eae0ee"],
      blobs: [
        [205, 102, 240, "rgba(245,170,160,0.45)"],
        [819, 153, 260, "rgba(240,205,170,0.45)"]
      ]
    });

    var camera = new THREE.PerspectiveCamera(38, stage.clientWidth / stage.clientHeight, 0.1, 80);
    camera.position.set(4.5, 4.2, 6.4);

    scene.add(new THREE.HemisphereLight(0xfff2df, 0x8a7f66, 1.0));
    var sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(4.5, 8, 3.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(softGL ? 1024 : 2048, softGL ? 1024 : 2048);
    sun.shadow.camera.left = -6.5; sun.shadow.camera.right = 6.5;
    sun.shadow.camera.top = 6.5; sun.shadow.camera.bottom = -6.5;
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 22;
    sun.shadow.bias = -0.0004;
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    var desk = new THREE.Mesh(
      new THREE.PlaneGeometry(46, 46),
      new THREE.MeshStandardMaterial({ map: LS8.Textures.wood(), roughness: 0.92 })
    );
    desk.rotation.x = -Math.PI / 2;
    desk.receiveShadow = true;
    scene.add(desk);

    var topMat = new THREE.MeshStandardMaterial({
      map: LS8.Textures.mat({ title: "APPLE 1 BENCH MAT · 60 x 40" }),
      roughness: 0.82
    });
    var sideMat = new THREE.MeshStandardMaterial({ color: 0x16233f, roughness: 0.85 });
    var matMesh = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.09, 4.8),
      [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
    matMesh.position.y = 0.048;
    matMesh.rotation.y = 0.045;
    matMesh.receiveShadow = true;
    matMesh.castShadow = true;
    scene.add(matMesh);

    /* ---- 共享材质 ---- */
    M.plastic = new THREE.MeshStandardMaterial({ color: 0x1d1f26, roughness: 0.85 });
    M.dark = new THREE.MeshStandardMaterial({ color: 0x2a2d36, roughness: 0.8 });
    M.silver = new THREE.MeshStandardMaterial({ color: 0xc9cdd4, metalness: 0.75, roughness: 0.32 });
    M.alu = new THREE.MeshStandardMaterial({ color: 0xd8dade, metalness: 0.6, roughness: 0.4 });
    M.gold = new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 0.85, roughness: 0.35 });
    M.navy = new THREE.MeshStandardMaterial({ color: 0x2a3a66, roughness: 0.5 });
    M.pink = new THREE.MeshStandardMaterial({ color: 0xe84f8e, roughness: 0.5 });
    M.white = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.4 });
    M.chip = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.4, metalness: 0.2 });
    M.cream = new THREE.MeshStandardMaterial({
      map: LS8.Textures.makeTex(512, 384, function (ctx, w, h) {
        ctx.fillStyle = "#e6ddc2";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(110,80,40,0.4)";
        ctx.lineWidth = 2;
        var seed = 11;
        function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
        for (var i = 0; i < 24; i++) {
          ctx.beginPath();
          var x = rnd() * w, y = rnd() * h;
          ctx.moveTo(x, y);
          for (var s = 0; s < 4; s++) {
            if (rnd() > 0.5) x += (rnd() - 0.5) * 140; else y += (rnd() - 0.5) * 100;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(60,45,20,0.85)";
        ctx.font = "bold 30px monospace";
        ctx.fillText("Apple Computer 1", 24, 46);
        ctx.font = "14px monospace";
        ctx.fillText("PALO ALTO · COPYRIGHT © 1976", 24, 70);
        ctx.fillText("MOS 6502 · 4K RAM · 44 PIN EDGE", 24, 90);
      }, { repeat: [1, 1] }),
      roughness: 0.65
    });

    /* ---- Apple I 主板（静态） ---- */
    var boardGroup = new THREE.Group();
    boardGroup.position.set(0.05, 0.095, 0.1);
    boardGroup.rotation.y = 0.02;
    var g = boardGroup;

    var pcbBase = mesh(new THREE.BoxGeometry(2.45, 0.04, 1.58), M.cream, 0, 0.02, 0);
    g.add(pcbBase);

    // RAM 插座阵列：8 行 × 3 座（右侧区域）
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 3; c++) {
        g.add(mesh(new THREE.BoxGeometry(0.17, 0.02, 0.07), M.dark, 0.42 + c * 0.21, 0.05, -0.6 + r * 0.155));
      }
    }
    // 零散小件
    for (var i = 0; i < 10; i++) {
      g.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 8), M.dark, -1.05 + (i % 5) * 0.5, 0.05, 0.35 + Math.floor(i / 5) * 0.12));
    }
    // 底边 44 金手指底座
    g.add(mesh(new THREE.BoxGeometry(2.0, 0.02, 0.07), M.gold, 0, 0.035, 0.72));

    scene.add(boardGroup);

    LS8.Scene3D = {
      scene: scene, camera: camera, renderer: renderer,
      board: boardGroup, mesh: mesh, M: M,
      setFanSpeed: function () { /* 无风扇 */ }
    };
  }

  function update() { /* 无旋转件 */ }

  LS8.SceneInit = init;
  LS8.SceneUpdate = update;
})(window.LS8 = window.LS8 || {});
