/* =========================================================
   PROJECT INTERACTIVE SCRIPTS & SIMULATIONS
   ========================================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initCopyButtons();
    
    // Project Specific Initializations
    if (document.getElementById("railway-sim-btn")) initRailwaySimulator();
    if (document.getElementById("crop-scan-btn")) initCropGuardScanner();
    if (document.getElementById("forecast-sim-btn")) initDemandForecasting();
    if (document.getElementById("pothole-sim-btn")) initPotholeDetection();
    if (document.getElementById("three-canvas-container")) init3DAlgorithmsVisualizer();
  });

  /* ---------- Tab Toggling ---------- */
  function initTabs() {
    document.querySelectorAll(".interactive-tabs").forEach(function (tabContainer) {
      var buttons = tabContainer.querySelectorAll(".tab-btn");
      var parent = tabContainer.closest(".interactive-container");
      if (!parent) return;
      
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var tabId = btn.getAttribute("data-tab");
          buttons.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          
          parent.querySelectorAll(".tab-panel").forEach(function (panel) {
            panel.classList.remove("active");
          });
          
          var activePanel = parent.querySelector("#panel-" + tabId);
          if (activePanel) activePanel.classList.add("active");
        });
      });
    });
  }

  /* ---------- Copy to Clipboard ---------- */
  function initCopyButtons() {
    document.querySelectorAll(".btn-copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var codeBlock = btn.closest(".code-container").querySelector("pre code");
        if (!codeBlock) return;
        
        var tempTextArea = document.createElement("textarea");
        tempTextArea.value = codeBlock.textContent.trim();
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        
        var oldText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.background = "var(--accent)";
        btn.style.color = "#fff";
        
        setTimeout(function () {
          btn.textContent = oldText;
          btn.style.background = "transparent";
          btn.style.color = "var(--accent)";
        }, 2000);
      });
    });
  }

  /* ---------- Railway Simulator ---------- */
  function initRailwaySimulator() {
    var btn = document.getElementById("railway-sim-btn");
    var trackProgress = document.getElementById("railway-track-progress");
    var nodes = document.querySelectorAll(".train-station-node");
    var logs = document.getElementById("railway-logs");
    var delayVal = document.getElementById("railway-delay-val");
    var maintVal = document.getElementById("railway-maint-val");
    var accuracyVal = document.getElementById("railway-accuracy-val");

    btn.addEventListener("click", function () {
      btn.disabled = true;
      trackProgress.style.width = "0%";
      nodes.forEach(function (node, idx) {
        node.classList.remove("active");
      });

      var trainName = document.getElementById("railway-train-select").value;
      var weather = document.getElementById("railway-weather-select").value;
      var maintFlag = document.getElementById("railway-maint-check").checked;
      var departureDelay = parseInt(document.getElementById("railway-delay-input").value) || 0;

      logs.innerHTML = "";
      logMessage("[INFO] Handshake with Supabase DB: Railway Core schema verified.");
      logMessage("[INFO] Fetching real-time schedule for " + trainName + ".");
      
      // Step through stations
      setTimeout(function () {
        trackProgress.style.width = "40%";
        nodes[0].classList.add("active");
        logMessage("[SENSOR] Passing Station: Delhi Junction. GPS lock stable.");
      }, 1000);

      setTimeout(function () {
        trackProgress.style.width = "75%";
        nodes[1].classList.add("active");
        logMessage("[AI] Running Groq API delay model on local weather telemetry: " + weather.toUpperCase() + ".");
      }, 2500);

      setTimeout(function () {
        trackProgress.style.width = "100%";
        nodes[2].classList.add("active");
        logMessage("[AI] Forecasting completed.");

        // Calculate simulated delay based on inputs
        var delay = departureDelay;
        if (weather === "heavy-rain") delay += 35;
        if (weather === "dense-fog") delay += 50;
        if (maintFlag) delay += 15;

        // Display outcomes
        if (delay === 0) {
          delayVal.textContent = "On Time";
          delayVal.className = "val ontime";
        } else {
          delayVal.textContent = "+" + delay + " mins";
          delayVal.className = "val delay";
        }

        maintVal.textContent = maintFlag || delay > 40 ? "REQUIRED" : "NORMAL";
        maintVal.className = "val " + (maintFlag || delay > 40 ? "delay" : "ontime");
        
        var confidence = 92 + Math.floor(Math.random() * 7);
        accuracyVal.textContent = confidence + "%";

        btn.disabled = false;
      }, 4000);
    });

    function logMessage(msg) {
      logs.innerHTML += msg + "\n";
      logs.scrollTop = logs.scrollHeight;
    }
  }

  /* ---------- Crop Guard Simulator ---------- */
  function initCropGuardScanner() {
    var btn = document.getElementById("crop-scan-btn");
    var laser = document.getElementById("crop-laser");
    var img = document.getElementById("crop-leaf-img");
    var bbox = document.getElementById("crop-bbox");
    var logs = document.getElementById("crop-logs");
    var diseaseVal = document.getElementById("crop-disease-val");
    var confVal = document.getElementById("crop-conf-val");
    var cureVal = document.getElementById("crop-cure-val");

    var sampleBtns = document.querySelectorAll(".crop-sample-btn");
    var currentSample = "tomato-blight";

    var samplesData = {
      "tomato-blight": {
        img: "../../assets/projects/crop_guard_main.jpg",
        name: "Tomato Early Blight",
        conf: "96.4%",
        cure: "Apply copper-based fungicide. Prune lower leaves to increase airflow."
      },
      "apple-scab": {
        img: "../../assets/projects/crop_guard_detail1.jpg",
        name: "Apple Scab",
        conf: "91.8%",
        cure: "Clean infected fallen leaves. Apply sulfur or organic preventive sprays."
      },
      "corn-rust": {
        img: "../../assets/projects/crop_guard_detail2.jpg",
        name: "Corn Common Rust",
        conf: "94.2%",
        cure: "Grow rust-resistant hybrid varieties. Apply fungicide at first sign of symptoms."
      }
    };

    sampleBtns.forEach(function (sBtn) {
      sBtn.addEventListener("click", function () {
        sampleBtns.forEach(function (b) { b.classList.remove("selected"); });
        sBtn.classList.add("selected");
        currentSample = sBtn.getAttribute("data-sample");
        img.src = samplesData[currentSample].img;
        
        // Reset outputs
        bbox.style.display = "none";
        diseaseVal.textContent = "—";
        confVal.textContent = "—";
        cureVal.textContent = "—";
      });
    });

    btn.addEventListener("click", function () {
      btn.disabled = true;
      laser.classList.add("scanning");
      bbox.style.display = "none";
      logs.innerHTML = "";

      logMessage("[INFO] Starting CROP GUARD ML Vision engine...");
      
      setTimeout(function () {
        logMessage("[INFO] Normalizing RGB pixel tensors...");
      }, 800);

      setTimeout(function () {
        logMessage("[INFO] Loading weights: mobilenet_v3_backbone.pth");
      }, 1500);

      setTimeout(function () {
        laser.classList.remove("scanning");
        
        // Position bounding box overlay
        bbox.style.top = "25%";
        bbox.style.left = "30%";
        bbox.style.width = "40%";
        bbox.style.height = "50%";
        bbox.style.display = "block";

        var res = samplesData[currentSample];
        diseaseVal.textContent = res.name;
        confVal.textContent = res.conf;
        cureVal.textContent = res.cure;

        logMessage("[AI] Prediction classification: " + res.name + " (" + res.conf + ")");
        btn.disabled = false;
      }, 3000);
    });

    function logMessage(msg) {
      logs.innerHTML += msg + "\n";
      logs.scrollTop = logs.scrollHeight;
    }
  }

  /* ---------- Demand Forecasting ---------- */
  function initDemandForecasting() {
    var btn = document.getElementById("forecast-sim-btn");
    var svg = document.getElementById("forecast-svg");
    var promoSlider = document.getElementById("forecast-promo");
    var priceSlider = document.getElementById("forecast-price");
    var seasonSlider = document.getElementById("forecast-season");
    var promoVal = document.getElementById("promo-val");
    var priceVal = document.getElementById("price-val");
    var seasonVal = document.getElementById("season-val");

    var salesText = document.getElementById("forecast-sales");
    var invText = document.getElementById("forecast-inv");

    // Dynamic slider label values
    promoSlider.addEventListener("input", function () { promoVal.textContent = "$" + promoSlider.value + "k"; });
    priceSlider.addEventListener("input", function () { priceVal.textContent = priceSlider.value + "%"; });
    seasonSlider.addEventListener("input", function () { seasonVal.textContent = seasonSlider.value + "x"; });

    function drawChart() {
      // Inputs
      var promo = parseFloat(promoSlider.value);
      var priceOffset = parseFloat(priceSlider.value) / 100;
      var seasonality = parseFloat(seasonSlider.value);

      // Base historical sales for Jan - Jun
      var actualSales = [45, 52, 48, 65, 58, 70];
      
      // Calculate forecasting for Jul - Dec
      var forecastSales = [];
      var currentBase = actualSales[actualSales.length - 1];

      for (var m = 0; m < 6; m++) {
        var baseDemand = currentBase + (m * 4);
        var promoImpact = promo * 1.5;
        var pricingImpact = 1 - (priceOffset * 1.2);
        var monthSeasonality = 1 + (Math.sin((m + 6) / 2) * 0.25 * seasonality);
        
        var prediction = Math.max(10, Math.round((baseDemand + promoImpact) * pricingImpact * monthSeasonality));
        forecastSales.push(prediction);
        currentBase = prediction * 0.9 + 5; // dynamic decaying walk
      }

      // Render chart path
      // Canvas width: 500, height: 200
      var width = svg.clientWidth || 500;
      var height = svg.clientHeight || 200;
      
      var allVals = actualSales.concat(forecastSales);
      var maxVal = Math.max.apply(null, allVals) + 20;

      // Draw grid lines
      svg.innerHTML = "";
      for (var y = 20; y < height; y += 40) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", y);
        line.setAttribute("x2", width);
        line.setAttribute("y2", y);
        line.setAttribute("class", "chart-grid-line");
        svg.appendChild(line);
      }

      // Generate points mapping
      var pointsActual = [];
      var pointsForecast = [];
      var totalPoints = 12;
      var dx = width / (totalPoints - 1);

      // Draw actual path (Jan - Jun)
      for (var i = 0; i < 6; i++) {
        var px = i * dx;
        var py = height - (actualSales[i] / maxVal) * height;
        pointsActual.push(px + "," + py);
      }

      var pathAct = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathAct.setAttribute("d", "M" + pointsActual.join(" L"));
      pathAct.setAttribute("class", "chart-line-actual");
      svg.appendChild(pathAct);

      // Connect forecast to last actual point
      var startX = 5 * dx;
      var startY = height - (actualSales[5] / maxVal) * height;
      pointsForecast.push(startX + "," + startY);

      for (var j = 0; j < 6; j++) {
        var fx = (j + 6) * dx;
        var fy = height - (forecastSales[j] / maxVal) * height;
        pointsForecast.push(fx + "," + fy);
      }

      var pathFore = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathFore.setAttribute("d", "M" + pointsForecast.join(" L"));
      pathFore.setAttribute("class", "chart-line-forecast");
      svg.appendChild(pathFore);

      // Add glow markers at the predicted peaks
      var peakVal = Math.max.apply(null, forecastSales);
      salesText.textContent = peakVal + " units";
      invText.textContent = Math.round(peakVal * 1.35) + " units";
    }

    btn.addEventListener("click", drawChart);
    drawChart(); // Draw once initially
  }

  /* ---------- Pothole Detection & 3D Profiler ---------- */
  function initPotholeDetection() {
    var btn = document.getElementById("pothole-sim-btn");
    var mainView = document.getElementById("pothole-img-view");
    var depthView = document.getElementById("pothole-depth-view");
    var select = document.getElementById("pothole-scene-select");
    
    var metricVolume = document.getElementById("pothole-volume");
    var metricDepth = document.getElementById("pothole-depth");
    var metricSeverity = document.getElementById("pothole-severity");

    var sceneData = {
      "scene-1": {
        img: "../../assets/projects/pothole_detection_main.jpg",
        volume: "0.14 m³",
        depth: "12 cm",
        severity: "MODERATE",
        color: "#ffd43b"
      },
      "scene-2": {
        img: "../../assets/projects/pothole_detection_detail1.jpg",
        volume: "0.45 m³",
        depth: "26 cm",
        severity: "CRITICAL",
        color: "#ff6b6b"
      }
    };

    select.addEventListener("change", function () {
      var current = sceneData[select.value];
      mainView.src = current.img;
      depthView.innerHTML = "";
      
      metricVolume.textContent = "—";
      metricDepth.textContent = "—";
      metricSeverity.textContent = "—";
    });

    btn.addEventListener("click", function () {
      btn.disabled = true;
      var current = sceneData[select.value];

      // Draw custom Canvas wireframe or height profiles simulating 3D depth-map
      depthView.innerHTML = "";
      var canvas = document.createElement("canvas");
      canvas.width = depthView.clientWidth || 300;
      canvas.height = depthView.clientHeight || 250;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      depthView.appendChild(canvas);

      var ctx = canvas.getContext("2d");
      var step = 0;
      
      function render3DMesh() {
        ctx.fillStyle = "#020202";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "rgba(248, 68, 46, 0.4)";
        ctx.lineWidth = 1;

        // Draw isometric height lines
        var linesCount = 20;
        var widthRatio = canvas.width / linesCount;
        var heightRatio = canvas.height / linesCount;

        for (var i = 1; i < linesCount; i++) {
          ctx.beginPath();
          for (var j = 1; j < linesCount; j++) {
            // Isometric math projection
            var x = (j - i) * widthRatio * 0.7 + canvas.width / 2;
            var y = (j + i) * heightRatio * 0.4 + 40;

            // Generate pothole crater depth deformation
            var dx = j - linesCount / 2;
            var dy = i - linesCount / 2;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            var depthProfile = 0;
            var radius = select.value === "scene-2" ? 6.5 : 4.5;
            if (distance < radius) {
              // Deepest point is inside
              var baseDepth = select.value === "scene-2" ? 50 : 25;
              depthProfile = Math.cos((distance / radius) * Math.PI / 2) * baseDepth;
            }

            // Animate building grid
            var scale = Math.min(1, step / 60);
            var deformedY = y + depthProfile * scale;

            if (j === 1) {
              ctx.moveTo(x, deformedY);
            } else {
              ctx.lineTo(x, deformedY);
            }
          }
          ctx.stroke();
        }

        step++;
        if (step <= 60) {
          requestAnimationFrame(render3DMesh);
        } else {
          // Display metrics
          metricVolume.textContent = current.volume;
          metricDepth.textContent = current.depth;
          metricSeverity.textContent = current.severity;
          metricSeverity.style.color = current.color;
          btn.disabled = false;
        }
      }
      
      render3DMesh();
    });
  }

  /* ---------- Algorithms Visualizer (WebGL / Three.js) ---------- */
  function init3DAlgorithmsVisualizer() {
    var container = document.getElementById("three-canvas-container");
    if (!container) return;

    // Load Three.js library from CDN if not already loaded
    if (typeof THREE === "undefined") {
      var script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.onload = function () {
        runThreeJSSetup();
      };
      document.head.appendChild(script);
    } else {
      runThreeJSSetup();
    }

    function runThreeJSSetup() {
      var scene, camera, renderer, barsGroup = [], gridCubes = [];
      var width = container.clientWidth;
      var height = container.clientHeight || 380;
      var activeAlgorithm = "quick-sort";
      var sortingArray = [];
      var size = 24;
      var sortingRunning = false;
      var speed = 250; // ms per operations

      var txtSwaps = document.getElementById("vis-swaps");
      var txtComps = document.getElementById("vis-comps");
      var btnStart = document.getElementById("vis-start-btn");
      var btnReset = document.getElementById("vis-reset-btn");
      var selAlgo = document.getElementById("vis-algo-select");
      var speedSlider = document.getElementById("vis-speed");

      if (speedSlider) {
        speedSlider.addEventListener("input", function() {
          speed = 600 - parseInt(speedSlider.value); // invert slider value to represent speed delay
        });
      }

      if (selAlgo) {
        selAlgo.addEventListener("change", function () {
          activeAlgorithm = selAlgo.value;
          resetScene();
        });
      }

      // Three.js basic elements
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x020202);
      
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 20, 30);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      // Light setup
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight1.position.set(10, 20, 15);
      scene.add(dirLight1);

      // Handle Resize
      window.addEventListener("resize", function () {
        var w = container.clientWidth;
        var h = container.clientHeight || 380;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });

      // Render Loop
      function animate() {
        requestAnimationFrame(animate);
        
        // Subtle rotate for viewing interest
        if (barsGroup && barsGroup.length > 0 && !sortingRunning) {
          scene.rotation.y += 0.002;
        }
        renderer.render(scene, camera);
      }
      animate();

      function generateArray() {
        sortingArray = [];
        for (var i = 0; i < size; i++) {
          sortingArray.push(3 + Math.floor(Math.random() * 12));
        }
      }

      function createSortingBars() {
        // Clear old geometries
        barsGroup.forEach(function (bar) { scene.remove(bar); });
        barsGroup = [];
        scene.rotation.set(0, 0, 0);

        var spacing = 1.2;
        var totalWidth = size * spacing;
        var startX = -totalWidth / 2;

        for (var i = 0; i < size; i++) {
          var h = sortingArray[i];
          var geo = new THREE.BoxGeometry(0.8, h, 0.8);
          
          // Orange gradient color
          var mat = new THREE.MeshPhongMaterial({
            color: 0xf8442e,
            specular: 0x555555,
            shininess: 30
          });
          
          var mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(startX + i * spacing, h / 2, 0);
          scene.add(mesh);
          barsGroup.push(mesh);
        }

        camera.position.set(0, 12, 24);
        camera.lookAt(0, 3, 0);
      }

      function createPathfindingGrid() {
        barsGroup.forEach(function (bar) { scene.remove(bar); });
        barsGroup = [];
        gridCubes.forEach(function (row) {
          row.forEach(function (cube) { scene.remove(cube); });
        });
        gridCubes = [];
        scene.rotation.set(0.3, -0.4, 0);

        var gridSize = 10;
        var spacing = 1.5;
        var offset = (gridSize * spacing) / 2;

        for (var i = 0; i < gridSize; i++) {
          var row = [];
          for (var j = 0; j < gridSize; j++) {
            var geo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
            var color = 0x222222;

            // Start node
            if (i === 1 && j === 1) color = 0x51cf66; // Green
            // Target node
            else if (i === 8 && j === 8) color = 0xff6b6b; // Red
            // Wall cubes
            else if ((i === 4 && j > 1 && j < 8) || (i === 6 && j > 2 && j < 9)) color = 0x555555;

            var mat = new THREE.MeshPhongMaterial({ color: color });
            var mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(i * spacing - offset, 0, j * spacing - offset);
            scene.add(mesh);
            row.push(mesh);
          }
          gridCubes.push(row);
        }

        camera.position.set(0, 18, 22);
        camera.lookAt(0, 0, 0);
      }

      function resetScene() {
        sortingRunning = false;
        if (txtSwaps) txtSwaps.textContent = "0";
        if (txtComps) txtComps.textContent = "0";
        
        if (activeAlgorithm === "pathfinding") {
          createPathfindingGrid();
        } else {
          generateArray();
          createSortingBars();
        }
      }

      // Visual Operations
      function swapBars(i, j) {
        var tempH = sortingArray[i];
        sortingArray[i] = sortingArray[j];
        sortingArray[j] = tempH;

        var tempMeshY = barsGroup[i].position.y;
        var tempMeshScaleY = barsGroup[i].scale.y;

        barsGroup[i].scale.y = barsGroup[j].scale.y;
        barsGroup[i].position.y = barsGroup[j].position.y;

        barsGroup[j].scale.y = tempMeshScaleY;
        barsGroup[j].position.y = tempMeshY;
      }

      function setBarColor(idx, colorHex) {
        if (barsGroup[idx]) {
          barsGroup[idx].material.color.setHex(colorHex);
        }
      }

      /* ---------- Bubble Sort Simulation ---------- */
      function runBubbleSort() {
        var len = size;
        var i = 0, j = 0;
        var comps = 0, swaps = 0;

        function step() {
          if (!sortingRunning) return;

          if (i < len) {
            if (j < len - i - 1) {
              setBarColor(j, 0xffd43b); // highlight comparison (yellow)
              setBarColor(j + 1, 0xffd43b);
              comps++;
              if (txtComps) txtComps.textContent = comps;

              if (sortingArray[j] > sortingArray[j + 1]) {
                swapBars(j, j + 1);
                swaps++;
                if (txtSwaps) txtSwaps.textContent = swaps;
              }

              setTimeout(function () {
                setBarColor(j, 0xf8442e); // restore original
                setBarColor(j + 1, 0xf8442e);
                j++;
                step();
              }, speed);
            } else {
              setBarColor(len - i - 1, 0x51cf66); // Mark sorted (green)
              j = 0;
              i++;
              step();
            }
          } else {
            // Done sorting
            sortingRunning = false;
            barsGroup.forEach(function (b) { b.material.color.setHex(0x51cf66); });
          }
        }

        step();
      }

      /* ---------- Quick Sort Simulation ---------- */
      function runQuickSort() {
        var comps = 0, swaps = 0;

        function partition(arr, low, high, callback) {
          var pivot = arr[high];
          setBarColor(high, 0x4fc1ff); // pivot color (blue)
          var idx = low - 1;
          var k = low;

          function loop() {
            if (!sortingRunning) return;
            if (k < high) {
              setBarColor(k, 0xffd43b); // comparing (yellow)
              comps++;
              if (txtComps) txtComps.textContent = comps;

              if (arr[k] < pivot) {
                idx++;
                swapBars(idx, k);
                swaps++;
                if (txtSwaps) txtSwaps.textContent = swaps;
              }

              setTimeout(function() {
                setBarColor(k, 0xf8442e);
                k++;
                loop();
              }, speed);
            } else {
              swapBars(idx + 1, high);
              swaps++;
              if (txtSwaps) txtSwaps.textContent = swaps;
              
              setTimeout(function() {
                setBarColor(high, 0xf8442e);
                setBarColor(idx + 1, 0x51cf66); // sorted pivot
                callback(idx + 1);
              }, speed);
            }
          }
          loop();
        }

        function quickSortHelper(arr, low, high, callback) {
          if (low < high) {
            partition(arr, low, high, function(pivotIdx) {
              quickSortHelper(arr, low, pivotIdx - 1, function() {
                quickSortHelper(arr, pivotIdx + 1, high, callback);
              });
            });
          } else {
            if (low >= 0 && low < size) setBarColor(low, 0x51cf66);
            callback();
          }
        }

        quickSortHelper(sortingArray, 0, size - 1, function() {
          sortingRunning = false;
          barsGroup.forEach(function (b) { b.material.color.setHex(0x51cf66); });
        });
      }

      /* ---------- BFS Pathfinding Simulation ---------- */
      function runBFSPathfinding() {
        var queue = [];
        var visited = {};
        var parent = {};
        var startNode = "1,1";
        var targetNode = "8,8";

        queue.push([1, 1]);
        visited[startNode] = true;
        
        var operations = 0;

        function getNeighbors(r, c) {
          var neighbors = [];
          var moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (var i = 0; i < moves.length; i++) {
            var nr = r + moves[i][0];
            var nc = c + moves[i][1];
            
            // Check boundaries
            if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
              // Check walls
              var isWall = (nr === 4 && nc > 1 && nc < 8) || (nr === 6 && nc > 2 && nc < 9);
              if (!isWall) {
                neighbors.push([nr, nc]);
              }
            }
          }
          return neighbors;
        }

        function step() {
          if (!sortingRunning) return;

          if (queue.length > 0) {
            var curr = queue.shift();
            var r = curr[0];
            var c = curr[1];
            var key = r + "," + c;

            operations++;
            if (txtComps) txtComps.textContent = operations;

            if (key === targetNode) {
              drawShortestPath(parent);
              return;
            }

            // Exclude coloring start/target
            if (key !== startNode) {
              gridCubes[r][c].material.color.setHex(0x4fc1ff); // Visited (neon cyan)
            }

            var neighbors = getNeighbors(r, c);
            neighbors.forEach(function (n) {
              var nkey = n[0] + "," + n[1];
              if (!visited[nkey]) {
                visited[nkey] = true;
                parent[nkey] = key;
                queue.push(n);
                
                if (nkey !== targetNode) {
                  gridCubes[n[0]][n[1]].material.color.setHex(0xc586c0); // Frontier (purple)
                }
              }
            });

            setTimeout(step, speed / 2);
          } else {
            sortingRunning = false;
          }
        }

        function drawShortestPath(parentMap) {
          var path = [];
          var curr = targetNode;
          while (curr && curr !== startNode) {
            path.push(curr);
            curr = parentMap[curr];
          }
          
          var pIdx = path.length - 1;
          function traceStep() {
            if (pIdx >= 0) {
              var coord = path[pIdx].split(",");
              var r = parseInt(coord[0]);
              var c = parseInt(coord[1]);
              
              if (path[pIdx] !== targetNode) {
                gridCubes[r][c].material.color.setHex(0xffd43b); // Path (yellow)
              }
              pIdx--;
              if (txtSwaps) txtSwaps.textContent = (path.length - pIdx - 1);
              setTimeout(traceStep, 150);
            } else {
              sortingRunning = false;
            }
          }
          traceStep();
        }

        step();
      }

      btnStart.addEventListener("click", function () {
        if (sortingRunning) return;
        sortingRunning = true;
        
        if (activeAlgorithm === "bubble-sort") {
          runBubbleSort();
        } else if (activeAlgorithm === "quick-sort") {
          runQuickSort();
        } else if (activeAlgorithm === "pathfinding") {
          runBFSPathfinding();
        }
      });

      btnReset.addEventListener("click", function () {
        resetScene();
      });

      // Run initial load
      resetScene();
    }
  }

})();
