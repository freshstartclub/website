document.querySelectorAll("[data-link]").forEach(item => {
    item.addEventListener("click", () => {
        window.open(item.getAttribute("data-link"), item.hasAttribute("data-link-newtab") ? "_blank" : "_self");
    });
});

var LeafScene = function (el) {
    this.viewport = el;
    this.world = document.createElement('div');
    this.leaves = [];

    this.options = {
        numLeaves: 20,
        wind: {
            magnitude: 1.2,
            maxSpeed: 12,
            duration: 300,
            start: 0,
            speed: 0
        },
    };

    this.width = this.viewport.offsetWidth;
    this.height = this.viewport.offsetHeight;
    this.timer = 0;

    // Mouse Position
    this.mouse = { x: this.width / 2, y: this.height / 2, active: false };

    // Reset leaf function
    this._resetLeaf = function (leaf) {
        leaf.x = this.width * 2 - Math.random() * this.width * 1.75;
        leaf.y = -10;
        leaf.z = Math.random() * 200;
        if (leaf.x > this.width) {
            leaf.x = this.width + 10;
            leaf.y = Math.random() * this.height / 2;
        }
        if (this.timer === 0) {
            leaf.y = Math.random() * this.height;
        }

        leaf.rotation.speed = Math.random() * 10;
        var randomAxis = Math.random();
        if (randomAxis > 0.5) {
            leaf.rotation.axis = 'X';
        } else if (randomAxis > 0.25) {
            leaf.rotation.axis = 'Y';
            leaf.rotation.x = Math.random() * 180 + 90;
        } else {
            leaf.rotation.axis = 'Z';
            leaf.rotation.x = Math.random() * 360 - 180;
            leaf.rotation.speed = Math.random() * 3;
        }

        leaf.xSpeedVariation = Math.random() * 0.8 - 0.4;
        leaf.ySpeed = Math.random() + 1.5;

        return leaf;
    }

    // Update leaf function
    this._updateLeaf = function (leaf) {
        var leafWindSpeed = this.options.wind.speed(this.timer - this.options.wind.start, leaf.y);
        var xSpeed = leafWindSpeed + leaf.xSpeedVariation;
        leaf.x -= xSpeed;
        leaf.y += leaf.ySpeed;
        leaf.rotation.value += leaf.rotation.speed;

        // Apply mouse interaction
        var dx = leaf.x - this.mouse.x;
        var dy = leaf.y - this.mouse.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50 && this.mouse.active) {
            // Push leaves away when close to the mouse
            var angle = Math.atan2(dy, dx);
            leaf.x += Math.cos(angle) * 5;
            leaf.y += Math.sin(angle) * 5;
        }

        if (distance < 10 && !this.mouse.active) {
            // If mouse is still, let leaves "land"
            leaf.x = this.mouse.x;
            leaf.y = this.mouse.y;
        }

        var t = `translateX(${leaf.x}px) translateY(${leaf.y}px) translateZ(${leaf.z}px) rotate${leaf.rotation.axis}(${leaf.rotation.value}deg)`;
        if (leaf.rotation.axis !== 'X') {
            t += ` rotateX(${leaf.rotation.x}deg)`;
        }
        leaf.el.style.transform = t;

        if (leaf.x < -10 || leaf.y > this.height + 10) {
            this._resetLeaf(leaf);
        }
    }

    this._updateWind = function () {
        if (this.timer === 0 || this.timer > (this.options.wind.start + this.options.wind.duration)) {
            this.options.wind.magnitude = Math.random() * this.options.wind.maxSpeed;
            this.options.wind.duration = this.options.wind.magnitude * 50 + (Math.random() * 20 - 10);
            this.options.wind.start = this.timer;

            var screenHeight = this.height;
            this.options.wind.speed = function (t, y) {
                var a = this.magnitude / 2 * (screenHeight - 2 * y / 3) / screenHeight;
                return a * Math.sin(2 * Math.PI / this.duration * t + (3 * Math.PI / 2)) + a;
            }
        }
    }

    // Mousemove event
    this._onMouseMove = function (event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
        this.mouse.active = true;
    };

    // Mouse stop event
    this._onMouseStop = function () {
        this.mouse.active = false;
    };

    window.addEventListener('mousemove', this._onMouseMove.bind(this));
    window.addEventListener('mouseleave', this._onMouseStop.bind(this));
}

LeafScene.prototype.init = function () {
    for (var i = 0; i < this.options.numLeaves; i++) {
        var leaf = {
            el: document.createElement('div'),
            x: 0,
            y: 0,
            z: 0,
            rotation: {
                axis: 'X',
                value: 0,
                speed: 0,
                x: 0
            },
            xSpeedVariation: 0,
            ySpeed: 0
        };

        this._resetLeaf(leaf);
        leaf.el.className = 'leaf';
        leaf.el.style.position = 'absolute';
        leaf.el.style.width = '20px';
        leaf.el.style.height = '20px';
        leaf.el.style.borderRadius = '50%';
        this.leaves.push(leaf);
        this.world.appendChild(leaf.el);
    }

    this.world.className = 'leaf-scene';
    this.viewport.appendChild(this.world);
    this.world.style.perspective = "400px";

    var self = this;
    window.onresize = function () {
        self.width = self.viewport.offsetWidth;
        self.height = self.viewport.offsetHeight;
    };
}

LeafScene.prototype.render = function () {
    this._updateWind();
    for (var i = 0; i < this.leaves.length; i++) {
        this._updateLeaf(this.leaves[i]);
    }

    this.timer++;
    requestAnimationFrame(this.render.bind(this));
}

// Start leaf scene
var leafContainer = document.querySelector('.falling-leaves');
var leaves = new LeafScene(leafContainer);

leaves.init();
leaves.render();

document.querySelector(".language-selector").addEventListener("change", function () {
    const selectedLanguage = this.value;
    i18n.setContext("language", selectedLanguage);
});
