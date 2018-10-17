var scene, camera, renderer;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var SPEED = 0.01;
//3D Objects
var block_model = './mus_block4techo_uvs.json';
var corner_model = './mus_block4L.json';

var green = 0x112233; //plane; Green: 0x33cc11
var grey = 0x333366; //0x336666;
var blue = 0x003366;
var cyan = 0x006666;
var white = 0xffffff;

//Numbers
var xN = 40;
var num = xN / 4;
var ic = 0;

Pictures = [];

function loadJSON(callback) {
    //JSON load jQuery
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'js/lista.json', true); //JSON
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


function init() {
    // THREE init
    scene = new THREE.Scene();
    scene.background
    initMesh();
    initCamera();
    initLights();
    initRenderer();

    document.body.appendChild(renderer.domElement);


}

function initCamera() {
    camera = new THREE.PerspectiveCamera(35, WIDTH / HEIGHT, 0.1, 10000);
    //camera.position.set(0, 3.5, 5);
    camera.position.set(-6.3, 6.5, 1);
    // camera.position.set(0, 11, 0);
    // camera.position.set(-9.423963550188258,  -0.30828443212886103, 1.4261387427719);
    camera.lookAt(scene.position);
}

function nextCamPos() {
    // camera.position.set(0, 0, 0);
    var n1 = 400;
    var n2 = 200;
    camera.position.set(Math.random() * n1 - n2, Math.random() * n1 - n2, Math.random() * n1 - n2);

    new TWEEN.Tween(camera.position).to({
            x: Math.random() * 800 - 400,
            y: Math.random() * 800 - 400,
            z: Math.random() * 800 - 400
        }, 2000)
        .easing(TWEEN.Easing.Elastic.Out).start();

}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(WIDTH, HEIGHT);
}

function initLights() {
    //BASIC
    // var light = new THREE.AmbientLight(0xff0000);
    // light.position.set( 9, -1, 11 );
    // scene.add(light);

    //3x
    var lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    // //xtra cada cuadro poner?
    lights[3] = new THREE.PointLight(0xffffff, 1, 0);
    lights[3].position.set(0, 0, -1.02);
    scene.add(lights[3]);


    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

}

var mesh = null;
var groupB = null;

function initMesh() {
    blocks = [];
    corners = [];
    pics = [];
    var loader = new THREE.JSONLoader();


    //First the geometry. I wanted it big and made it big
    var skyGeo = new THREE.SphereGeometry(1.1 * (numByRow * (numByRow / 1.25)), 25, 25);
    var textureSkyloader = new THREE.TextureLoader();
    textureSky = textureSkyloader.load("img/panorama_texture.jpg");
    //Create the material for the skybox here
    var materialSky = new THREE.MeshPhongMaterial({
        map: textureSky,
    });
    //Set everything together and add it to the scene here.
    var sky = new THREE.Mesh(skyGeo, materialSky);
    sky.material.side = THREE.BackSide;
    sky.position.set(numByRow - 1, 0, numByRow);
    scene.add(sky);

    //PLANE CENTER
    //var geometry = new THREE.PlaneGeometry(20, 20, 0);
    var geometry = new THREE.PlaneGeometry(numByRow * 2, numByRow * 2, 0);
    var bedar = new THREE.ImageUtils.loadTexture("img/bedar.jpg");
    var material_bedar = new THREE.MeshBasicMaterial({ color: green, side: THREE.DoubleSide, map: bedar });
    plane = new THREE.Mesh(geometry, material_bedar);
    plane.rotation.set(Math.PI / 2, Math.PI, 0);
    //plane.position.set(9, -1, 11)
    //-2, 0, 0
    // -2 + ((numByRow * 2)/2)
    ajust = 1.10;
    a = (((numByRow * 2) / 2) - 2) + ajust;
    plane.position.set(a, -1.02, a + (ajust * 2));
    scene.add(plane);

    //CORNERS + PASILLOS
    var granito = new THREE.ImageUtils.loadTexture("img/granito.jpg");
    var granito_bmp = new THREE.ImageUtils.loadTexture("img/granito_bmp.jpg");
    var material = new THREE.MeshBasicMaterial({ color: white, side: THREE.DoubleSide });

    /*  10*10*10 blocks
    (-2, 0, 0)
    (-2, 0, 22)
    (20, 0, 22)
    (20, 0, 0) */

    //cornerPositions
    corPos = [
        [-2, 0, 0, 0],
        [numByRow * 2, 0, numByRow * 2.5, Math.PI],
        [-2, 0, numByRow * 2.5, Math.PI / 2],
        [numByRow * 2, 0, 0, Math.PI + (Math.PI / 2)]
    ];
    //A, B, C, D CORNERS
    /* posx = corPos[i][0];
    posy = corPos[i][1];
    posz = corPos[i][2];
    rot = corPos[i][3];

    console.log(corPos[i]);
    console.log(posx);
    console.log(posy);
    console.log(posz); */

    /*     for (ic = 0; ic < 4; ic++) {
            console.log(i);
            
            loader.load(corner_model, function(geometry, material) {
                corners.push(new THREE.Mesh(geometry, material));
                var pos = corners.length - 1;
                corners[pos].position.set(posx, posy, posz);
                //corners[pos].position.set(corPos[i][0], corPos[i][1], corPos[i][2]);
                corners[pos].rotation.y = rot;
                corners[pos].material = new THREE.MeshLambertMaterial({
                    color: grey,
                    side: THREE.DoubleSide,
                    map: granito,
                });
                scene.add(corners[pos]);
            })
        } */


    //A Corner
    loader.load(corner_model, function(geometry, material) {
        corners.push(new THREE.Mesh(geometry, material));
        var pos = corners.length - 1
        corners[pos].position.set(-2, 0, 0);
        /* corners[pos].material = new THREE.MeshLambertMaterial({
            color: grey,
            side: THREE.DoubleSide,
            map: granito,

        }); */
        corners[pos].material = new THREE.MeshPhongMaterial({
            color: 0x445544, // 0x444444, 0x111333, 0x998E8E,
            side: THREE.DoubleSide,
            map: granito,
            specular: 0x222222,
            shininess: 1,
            bumpMap: granito_bmp, //texture granito, granito_bmp
            bumpScale: 0.005
        });
        // new THREE.MeshPhongMaterial( { specular: 0x101010, shininess: 10, reflectivity: 0.1, side: THREE.DoubleSide } );
        scene.add(corners[pos]);
    })

    //B corner
    loader.load(corner_model, function(geometry, material) {
        corners.push(new THREE.Mesh(geometry, material));
        var pos = corners.length - 1
        corners[pos].position.set(numByRow * 2, 0, 0);
        corners[pos].rotation.y = Math.PI + (Math.PI / 2);
        corners[pos].material = new THREE.MeshLambertMaterial({ color: grey, side: THREE.DoubleSide, wireframe: true }); // new THREE.MeshPhongMaterial( { specular: 0x101010, shininess: 10, reflectivity: 0.1, side: THREE.DoubleSide } );
        scene.add(corners[pos]);
    })

    unEvenDist = 2.17; //n30=2.25 //n17=2.4 //n16= 2.5 //n45=
    //C corner
    loader.load(corner_model, function(geometry, material) {
            corners.push(new THREE.Mesh(geometry, material));
            var pos = corners.length - 1
            corners[pos].position.set(numByRow * 2, 0, numByRow * unEvenDist);
            corners[pos].rotation.y = Math.PI;
            //corners[pos].material = new THREE.MeshLambertMaterial({ color: grey, side: THREE.DoubleSide, wireframe: true }); // new THREE.MeshPhongMaterial( { specular: 0x101010, shininess: 10, reflectivity: 0.1, side: THREE.DoubleSide } );
            corners[pos].material = new THREE.MeshPhongMaterial({
                color: 0x445544, // 0x444444, 0x111333, 0x998E8E,
                side: THREE.DoubleSide,
                map: granito,
                specular: 0x222222,
                shininess: 1,
                bumpMap: granito_bmp, //texture granito, granito_bmp
                bumpScale: 0.005
            });
            scene.add(corners[pos]);
        })
        //D corner
    loader.load(corner_model, function(geometry, material) {
        corners.push(new THREE.Mesh(geometry, material));
        var pos = corners.length - 1
        corners[pos].position.set(-2, 0, numByRow * unEvenDist);
        corners[pos].rotation.y = Math.PI / 2;
        corners[pos].material = new THREE.MeshLambertMaterial({ color: grey, side: THREE.DoubleSide, wireframe: true }); // new THREE.MeshPhongMaterial( { specular: 0x101010, shininess: 10, reflectivity: 0.1, side: THREE.DoubleSide } );
        scene.add(corners[pos]);
    })


    /************
     * GALLERYS
     ************/
    //PASILLO A
    var groupA = new THREE.Group();
    for (var i = 0; i < numByRow; i++) {
        loader.load(block_model, function(geometry, material) {
            blocks.push(new THREE.Mesh(geometry, material));
            //console.log(blocks);
            var pos = blocks.length - 1
            blocks[pos].position.set(pos * 2, 0, 0);

            blocks[pos].material = new THREE.MeshPhongMaterial({
                color: 0x445544, // 0x444444, 0x111333, 0x998E8E,
                side: THREE.DoubleSide,
                map: granito,
                specular: 0x222222,
                shininess: 1,
                bumpMap: granito_bmp, //texture
                bumpScale: 0.005
            });
            // new THREE.MeshPhongMaterial( { specular: 0x101010, shininess: 10, reflectivity: 0.1, side: THREE.DoubleSide } );
            groupA.add(blocks[pos]);
        })
    }
    scene.add(groupA);

    groupB = new THREE.Group();
    groupB.copy(groupA, true);
    groupB.position.set(2, 2, 2);
    scene.add(groupB);

    //RESTO DE GALERIAS/PASILLOS B.C.D {
    //C
    blocksB = [];
    for (var i = 0; i < numByRow; i++) {
        loader.load(block_model, function(geometry, material) {
            blocksB.push(new THREE.Mesh(geometry, material));
            console.log(blocksB);
            var pos = blocksB.length - 1;
            // blocksB[pos].rotation.set(0, 3.15, 0);
            blocksB[pos].rotation.y = Math.PI;
            // blocksB[pos].rotation.set( new THREE.Vector3( 0, 0, Math.PI / 2) );
            blocksB[pos].position.set(pos * 2, 0, numByRow * unEvenDist);
            //blocksB[pos].material = new THREE.MeshLambertMaterial({ color: grey, side: THREE.DoubleSide });
            blocksB[pos].material = new THREE.MeshPhongMaterial({
                color: 0x445544, // 0x444444, 0x111333, 0x998E8E,
                side: THREE.DoubleSide,
                map: granito,
                specular: 0x222222,
                shininess: 1,
                //bumpMap: granito_bmp, //texture
                bumpScale: 0.005
            });
            scene.add(blocksB[pos]);
        })
    }
    // 90 L PASILLOS
    blocksC = [];
    for (var i = 0; i < numByRow; i++) {
        loader.load(block_model, function(geometry, material) {
            blocksC.push(new THREE.Mesh(geometry, material));
            console.log(blocksC);
            var pos = blocksC.length - 1
                //blocksC[pos].rotation.set(0, 1.575, 0);
            blocksC[pos].rotation.y = Math.PI / 2;
            blocksC[pos].position.set(-2, 0, pos * +2 + 2);
            //blocksC[pos].material = new THREE.MeshLambertMaterial({ color: grey, side: THREE.DoubleSide });
            blocksC[pos].material = new THREE.MeshPhongMaterial({
                color: 0x445544, // 0x444444, 0x111333, 0x998E8E,
                side: THREE.DoubleSide,
                map: granito,
                specular: 0x222222,
                shininess: 1,
                bumpMap: granito_bmp, //texture
                bumpScale: 0.005
            });
            scene.add(blocksC[pos]);
        })
    }
    // D PASILLOS
    blocksD = [];
    for (var i = 0; i < numByRow; i++) {
        loader.load(block_model, function(geometry, material) {
            blocksD.push(new THREE.Mesh(geometry, material));
            console.log(blocksD);
            var pos = blocksD.length - 1
                // blocksD[pos].rotation.set(0, 4.725, 0);
            blocksD[pos].rotation.y = Math.PI + (Math.PI / 2);
            blocksD[pos].position.set(numByRow * 2, 0, pos * 2 + 2);
            //blocksD[pos].material = new THREE.MeshLambertMaterial({ color: grey, side: THREE.DoubleSide });
            blocksD[pos].material = new THREE.MeshPhongMaterial({
                color: 0x445544, // 0x444444, 0x111333, 0x998E8E,
                side: THREE.DoubleSide,
                map: granito,
                specular: 0x222222,
                shininess: 1,
                bumpMap: granito_bmp, //texture
                bumpScale: 0.005
            });
            scene.add(blocksD[pos]);
        })
    }

    //END PASILLOS }

    //// CUADROS
    //Carga JSON imagenes/titulos/...
    //lista.json

    var textLoader = new THREE.FontLoader();
    var textMat = new THREE.MeshNormalMaterial();

    textLoader.load('fonts/droid/droid_sans_regular.typeface.json', function(font) {

        /*   var text1 = new THREE.TextGeometry('Pilar Cantera Zabala', {
              font: font,
              size: 0.1,
              height: 0.05,
              curveSegments: 18,
              bevelEnabled: true,
              bevelThickness: 0.01,
              bevelSize: 0.01,
              bevelSegments: 5
          });
          textMesh = new THREE.Mesh(text1, textMat)
          textMesh.position.set(4, 0, 4);
          //textMesh.resize() position.set(4, 0, 4);
          scene.add(textMesh); */

        textSize = 0.125 * numByRow;
        textDepth = textSize / 3;
        var text2 = new THREE.TextGeometry('Pilar Cantera Zabala', {
            font: font,
            size: textSize, //1.0 * 30pic
            height: textDepth,
            curveSegments: 6,
            bevelEnabled: false,

        });
        textMesh2 = new THREE.Mesh(text2, textMat)
        textMesh2.position.set(numByRow - (textSize * 4), -1, numByRow - (textSize * 4));
        textMesh2.rotation.set(0, -Math.PI / 4, 0);
        //textMesh.resize() position.set(4, 0, 4);
        scene.add(textMesh2);
    });


    pics = []; //contains meshes
    positions = []; //contains pics positions in 3d space
    var img_path = "img/cuadros/"; //+Pictures

    //A Pics   
    countPics = 0;
    for (var i = 0; i < numByRow; i++) {

        var geometry = new THREE.PlaneGeometry(1.2, 0.9, 0);
        var path = img_path + Pictures[i];
        var cuadro = new THREE.ImageUtils.loadTexture(path);
        var material = new THREE.MeshBasicMaterial({ map: cuadro, side: THREE.DoubleSide });

        pics.push(new THREE.Mesh(geometry, material));
        var pos = pics.length - 1;
        //pics[pos].position.set(i * 2.6, 0, -1.08);
        pics[pos].position.set(i * 2.0, 0, -1.08);
        scene.add(pics[pos]);

        //safe Picture positions
        pic_pos = [i * 2.6, 0, -1.08]
        positions.push(pic_pos);
        countPics++;
    }

    //B Pics   
    for (var i = 0; i < numByRow; i++) {
        var geometry = new THREE.PlaneGeometry(1.2, 0.9, 0);
        var path = img_path + Pictures[countPics];
        var cuadro = new THREE.ImageUtils.loadTexture(path);
        var material = new THREE.MeshBasicMaterial({ map: cuadro, side: THREE.DoubleSide });

        pics.push(new THREE.Mesh(geometry, material));
        var pos = pics.length - 1;
        //pics[pos].position.set(i * 2.6, 0, -1.08);
        pics[pos].position.set((numByRow * 2.0) + 1.08, 0, (i * 2) + 2);
        pics[pos].rotation.set(0, Math.PI / 2, 0);
        scene.add(pics[pos]);

        //safe Picture positions
        pic_pos = [i * 2.6, 0, -1.08]
        positions.push(pic_pos);
        countPics++;
    }

    //C Pics   
    for (var i = 0; i < numByRow; i++) {
        var geometry = new THREE.PlaneGeometry(1.2, 0.9, 0);
        var path = img_path + Pictures[countPics];
        var cuadro = new THREE.ImageUtils.loadTexture(path);
        var material = new THREE.MeshBasicMaterial({ map: cuadro, side: THREE.DoubleSide });

        pics.push(new THREE.Mesh(geometry, material));
        var pos = pics.length - 1;
        pics[pos].position.set((i * 2), 0, (numByRow * 2) + 3.08);
        pics[pos].rotation.set(0, Math.PI, 0);
        scene.add(pics[pos]);

        //safe Picture positions
        pic_pos = [i * 2.6, 0, -1.08]
        positions.push(pic_pos);
        countPics++;
    }

    //D Pics   
    for (var i = 0; i < numByRow; i++) {
        var geometry = new THREE.PlaneGeometry(1.2, 0.9, 0);
        var path = img_path + Pictures[countPics];
        var cuadro = new THREE.ImageUtils.loadTexture(path);
        var material = new THREE.MeshBasicMaterial({ map: cuadro, side: THREE.DoubleSide });

        pics.push(new THREE.Mesh(geometry, material));
        var pos = pics.length - 1;
        pics[pos].position.set(-3.08, 0, (i * 2) + 2);
        pics[pos].rotation.set(0, Math.PI + (Math.PI / 2), 0);
        scene.add(pics[pos]);

        //safe Picture positions
        pic_pos = [i * 2.6, 0, -1.08]
        positions.push(pic_pos);
        countPics++;
    }


}

function resize() {
    //Get Canvas(for resize)
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }
    resize(gl.canvas);

    var realToCSSPixels = window.devicePixelRatio;

    //Lookup the size the browser is displaying the canvas in CSS pixels
    //and compute a size needed to make our drawingbuffer match it in
    //device pixels.
    var displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
    var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    //Check if the canvas is not the same size.
    if (gl.canvas.width !== displayWidth ||
        gl.canvas.height !== displayHeight) {

        //Make the canvas the same size
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
    }
}

//AutoResize
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function render() {
    requestAnimationFrame(render);
    //rotateMesh();
    renderer.render(scene, camera);
}

//BEGIN
loadJSON(function(response) {
    art_JSON = JSON.parse(response); //obj

    Pictures = $.map(art_JSON, function(value, index) {
        return value;
    });
    console.log(Pictures);

    //Picture load vars
    numPics = Pictures.length;
    numByRow = Math.ceil(numPics / 4);

    //Standard run
    init();
    render();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
});

// init();
// render();
// controls = new THREE.OrbitControls( camera, renderer.domElement );



// OK SKYDOME (or transparent background)
// CAMERA CONTROLS *
// Adjust all vars and textures *
// Image scaling, uploading
// WebGL compatibility check
// LOD auto/menu(fx lvl)
//loader animation
//...
// Simple website, Bootstrap
//