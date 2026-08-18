/**
 * NAVEEN SRI T — 3D CYBER-TERMINAL ENGINE
 * WebGL Background Matrix · Hero 3D Holographic Core · SCRIMP 3D Topology
 * 3D Spatial Card Tilt Engine · Web Audio Cyber Synthesizer · Cyber CLI
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE & GLOBAL CONFIGURATION
  // =========================================================================
  const state = {
    audioEnabled: false,
    audioCtx: null,
    coreMode: 'shield', // 'shield' | 'scan' | 'overclock'
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0, rawX: 0, rawY: 0 },
    fps: 60
  };

  // =========================================================================
  // 2. PROCEDURAL WEB AUDIO SYNTHESIZER
  // =========================================================================
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playCyberSound(type) {
    if (!state.audioEnabled || !state.audioCtx) return;
    try {
      const ctx = state.audioCtx;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(2100, now + 0.03);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'mode') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'scan') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.08);
        osc.frequency.linearRampToValueAtTime(440, now + 0.16);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audio-toggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      state.audioEnabled = !state.audioEnabled;
      audioToggleBtn.classList.toggle('active', state.audioEnabled);
      audioToggleBtn.title = state.audioEnabled ? 'Audio: ONLINE' : 'Audio: MUTED';
      audioToggleBtn.innerHTML = state.audioEnabled ? '🔊' : '🔇';
      if (state.audioEnabled) playCyberSound('mode');
    });
  }

  // =========================================================================
  // 3. MOUSE TRACKING & CUSTOM 3D RETICLE
  // =========================================================================
  const cursorElem = document.getElementById('custom-cursor');
  const coordElem = document.getElementById('cursor-coords');
  const targetTelemetry = document.getElementById('hud-coords');

  window.addEventListener('mousemove', (e) => {
    state.mouse.rawX = e.clientX;
    state.mouse.rawY = e.clientY;
    state.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (cursorElem) {
      cursorElem.style.left = `${e.clientX}px`;
      cursorElem.style.top = `${e.clientY}px`;
      if (coordElem) {
        coordElem.textContent = `X:${Math.round(e.clientX)} Y:${Math.round(e.clientY)}`;
      }
    }
    if (targetTelemetry) {
      targetTelemetry.textContent = `${Math.round(e.clientX)},${Math.round(e.clientY)}`;
    }
  });

  // Cursor Hover Feedback
  document.querySelectorAll('a, button, .tilt-card-3d, .mode-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      playCyberSound('hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
    el.addEventListener('click', () => {
      playCyberSound('click');
    });
  });

  // =========================================================================
  // 4. 3D SPATIAL CARD TILT & SPECULAR GLARE ENGINE
  // =========================================================================
  const tiltCards = document.querySelectorAll('.tilt-card-3d');

  tiltCards.forEach((card) => {
    if (!card.querySelector('.glare-overlay')) {
      const glare = document.createElement('div');
      glare.className = 'glare-overlay';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });

  // =========================================================================
  // 5. THREE.JS 3D BACKGROUND WORLD (Grid Waves + Floating Particles)
  // =========================================================================
  function initBackground3D() {
    const canvas = document.getElementById('webgl-bg');
    if (!canvas) return;

    if (!window.THREE) {
      // 2D Canvas Fallback if WebGL/Three is unavailable
      const ctx = canvas.getContext('2d');
      function draw2DGrid() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.strokeStyle = 'rgba(98, 232, 238, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
      draw2DGrid();
      window.addEventListener('resize', draw2DGrid);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080a0c, 0.0022);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 45, 120);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // A. Cyber Grid Ground Mesh with Sine Waves
    const gridWidth = 280;
    const gridDepth = 280;
    const gridSegments = 44;
    const gridGeometry = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegments, gridSegments);
    gridGeometry.rotateX(-Math.PI / 2);

    const posAttr = gridGeometry.attributes.position;
    const originalPositions = new Float32Array(posAttr.array);

    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x22353c,
      wireframe: true,
      transparent: true,
      opacity: 0.42
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.position.y = -35;
    scene.add(gridMesh);

    // B. Floating Cybersecurity Particle Nodes
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 280;
      particlePositions[i + 1] = (Math.random() - 0.5) * 120 + 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 280;

      particleSpeeds[i] = (Math.random() - 0.5) * 0.04;
      particleSpeeds[i + 1] = (Math.random() - 0.5) * 0.04;
      particleSpeeds[i + 2] = (Math.random() - 0.5) * 0.04;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x62e8ee,
      size: 2.2,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Resize Handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    let clock = new THREE.Clock();

    function animateBg() {
      requestAnimationFrame(animateBg);
      const elapsedTime = clock.getElapsedTime();

      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.05;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.05;

      camera.position.x = state.mouse.x * 20;
      camera.position.y = 45 + state.mouse.y * 12 - (window.scrollY * 0.035);
      camera.lookAt(0, -5, 0);

      const positions = gridGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const origX = originalPositions[i];
        const origZ = originalPositions[i + 2];
        const wave = Math.sin(origX * 0.05 + elapsedTime * 1.5) * Math.cos(origZ * 0.05 + elapsedTime * 1.2) * 3.8;
        positions[i + 1] = originalPositions[i + 1] + wave;
      }
      gridGeometry.attributes.position.needsUpdate = true;

      const pPos = particleGeometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        pPos[i] += particleSpeeds[i];
        pPos[i + 1] += particleSpeeds[i + 1];
        pPos[i + 2] += particleSpeeds[i + 2];

        if (Math.abs(pPos[i]) > 140) pPos[i] = -pPos[i];
        if (Math.abs(pPos[i + 1]) > 70) pPos[i + 1] = -pPos[i + 1];
        if (Math.abs(pPos[i + 2]) > 140) pPos[i + 2] = -pPos[i + 2];
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animateBg();
  }

  // =========================================================================
  // 6. HERO 3D HOLOGRAPHIC CYBER CORE
  // =========================================================================
  function initHero3DCore() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas || !window.THREE) return;

    const wrapper = canvas.parentElement;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, wrapper.clientWidth / wrapper.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Glowing Core (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xc9f04a,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Inner Vertex Points
    const innerPoints = new THREE.Points(
      innerGeo,
      new THREE.PointsMaterial({
        color: 0x62e8ee,
        size: 0.12,
        blending: THREE.AdditiveBlending
      })
    );
    coreGroup.add(innerPoints);

    // Orbit Ring 1 (Torus)
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.022, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x62e8ee,
      transparent: true,
      opacity: 0.7
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Orbit Ring 2 (Torus)
    const ring2Geo = new THREE.TorusGeometry(2.65, 0.022, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xc9f04a,
      transparent: true,
      opacity: 0.55
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 4;
    coreGroup.add(ring2);

    // Orbit Ring 3 (Outer Sensor Cage)
    const ring3Geo = new THREE.DodecahedronGeometry(3.0, 0);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x3d535b,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    coreGroup.add(ring3);

    // Satellite Data Packets (Orbiting Spheres)
    const packetCount = 4;
    const packetGroup = new THREE.Group();
    const packetGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending });

    for (let i = 0; i < packetCount; i++) {
      const p = new THREE.Mesh(packetGeo, packetMat);
      packetGroup.add(p);
    }
    coreGroup.add(packetGroup);

    // Interactive Drag Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0.005, y: 0.008 };

    wrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      dragVelocity.x = deltaY * 0.005;
      dragVelocity.y = deltaX * 0.005;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Touch support for mobile
    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      dragVelocity.x = deltaY * 0.005;
      dragVelocity.y = deltaX * 0.005;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Mode Selector Buttons
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.coreMode = btn.dataset.mode;
        playCyberSound('mode');

        if (state.coreMode === 'shield') {
          innerMat.color.setHex(0xc9f04a);
          ring1Mat.color.setHex(0x62e8ee);
          ring2Mat.color.setHex(0xc9f04a);
        } else if (state.coreMode === 'scan') {
          innerMat.color.setHex(0x62e8ee);
          ring1Mat.color.setHex(0x62e8ee);
          ring2Mat.color.setHex(0x62e8ee);
        } else if (state.coreMode === 'overclock') {
          innerMat.color.setHex(0xff4365);
          ring1Mat.color.setHex(0xff4365);
          ring2Mat.color.setHex(0xc9f04a);
        }
      });
    });

    // Resize Handler
    const resizeObserver = new ResizeObserver(() => {
      if (!wrapper.clientWidth || !wrapper.clientHeight) return;
      camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    });
    resizeObserver.observe(wrapper);

    // Animation Loop
    let coreClock = new THREE.Clock();

    function animateHeroCore() {
      requestAnimationFrame(animateHeroCore);
      const time = coreClock.getElapsedTime();

      if (!isDragging) {
        dragVelocity.x *= 0.94;
        dragVelocity.y *= 0.94;
      }

      let speedMultiplier = state.coreMode === 'overclock' ? 2.5 : state.coreMode === 'scan' ? 1.4 : 1.0;

      coreGroup.rotation.x += dragVelocity.x + (0.003 * speedMultiplier);
      coreGroup.rotation.y += dragVelocity.y + (0.006 * speedMultiplier);

      ring1.rotation.z = time * 0.6 * speedMultiplier;
      ring2.rotation.x = -time * 0.8 * speedMultiplier;
      ring3.rotation.y = time * 0.2 * speedMultiplier;

      const pulse = 1 + Math.sin(time * 3 * speedMultiplier) * 0.04;
      innerCore.scale.set(pulse, pulse, pulse);
      innerPoints.scale.set(pulse, pulse, pulse);

      for (let i = 0; i < packetCount; i++) {
        const p = packetGroup.children[i];
        const angle = time * (1.2 + i * 0.3) * speedMultiplier + (i * Math.PI / 2);
        const radius = 2.4 + Math.sin(time + i) * 0.2;
        p.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.5) * 0.6, Math.sin(angle) * radius);
      }

      renderer.render(scene, camera);
    }

    animateHeroCore();
  }

  // =========================================================================
  // 7. SCRIMP 3D INTERACTIVE INCIDENT RESPONSE TOPOLOGY
  // =========================================================================
  function initScrimp3D() {
    const canvas = document.getElementById('scrimp-3d-canvas');
    if (!canvas || !window.THREE) return;

    const wrapper = canvas.parentElement;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, wrapper.clientWidth / wrapper.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const topologyGroup = new THREE.Group();
    scene.add(topologyGroup);

    // 6 Incident Response Nodes
    const nodesData = [
      { name: 'Threat Ingress', pos: [-2.6, 1.2, 0], color: 0xff4365, status: 'DETECTED' },
      { name: 'Firewall Filter', pos: [-1.2, -0.4, 0.8], color: 0x62e8ee, status: 'ACTIVE' },
      { name: 'SOC Analyzer', pos: [0, 1.6, -0.6], color: 0xc9f04a, status: 'SCANNING' },
      { name: 'Forensic Isolation', pos: [1.3, -0.6, 0.5], color: 0x62e8ee, status: 'CONTAINED' },
      { name: 'Evidence Vault', pos: [2.5, 1.1, -0.4], color: 0xc9f04a, status: 'SECURED' },
      { name: 'Authority Uplink', pos: [0.8, -1.8, 0], color: 0x62e8ee, status: 'DISPATCHED' }
    ];

    const nodeMeshes = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.35, 0);

    nodesData.forEach((data) => {
      const mat = new THREE.MeshBasicMaterial({
        color: data.color,
        wireframe: true
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.set(data.pos[0], data.pos[1], data.pos[2]);

      const coreMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshBasicMaterial({ color: data.color, blending: THREE.AdditiveBlending })
      );
      mesh.add(coreMesh);

      mesh.userData = data;
      topologyGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Connecting Network Lines
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [1, 3]
    ];

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2f464d,
      transparent: true,
      opacity: 0.65
    });

    connections.forEach(([fromIdx, toIdx]) => {
      const p1 = new THREE.Vector3(...nodesData[fromIdx].pos);
      const p2 = new THREE.Vector3(...nodesData[toIdx].pos);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const line = new THREE.Line(lineGeo, lineMat);
      topologyGroup.add(line);
    });

    // Data Packets Traversing Lines
    const packets = [];
    connections.forEach(([fromIdx, toIdx], i) => {
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xc9f04a, blending: THREE.AdditiveBlending })
      );
      topologyGroup.add(pMesh);
      packets.push({
        mesh: pMesh,
        from: new THREE.Vector3(...nodesData[fromIdx].pos),
        to: new THREE.Vector3(...nodesData[toIdx].pos),
        progress: (i * 0.2) % 1
      });
    });

    // Raycaster for Hover Telemetry
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();
    const telemetryElem = document.getElementById('scrimp-status-text');

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hovered = intersects[0].object;
        if (telemetryElem) {
          telemetryElem.innerHTML = `TARGET: <strong>${hovered.userData.name}</strong> [${hovered.userData.status}]`;
        }
      }
    });

    // Auto rotate & packet flow
    let sClock = new THREE.Clock();

    function animateScrimp() {
      requestAnimationFrame(animateScrimp);
      const time = sClock.getElapsedTime();

      topologyGroup.rotation.y = time * 0.15;
      topologyGroup.rotation.x = Math.sin(time * 0.1) * 0.1;

      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.x = time * (0.5 + idx * 0.1);
        mesh.rotation.y = time * (0.8 + idx * 0.1);
      });

      packets.forEach((pkt) => {
        pkt.progress += 0.008;
        if (pkt.progress > 1) pkt.progress = 0;
        pkt.mesh.position.lerpVectors(pkt.from, pkt.to, pkt.progress);
      });

      renderer.render(scene, camera);
    }

    animateScrimp();

    // Resize
    const scrimpResize = new ResizeObserver(() => {
      if (!wrapper.clientWidth || !wrapper.clientHeight) return;
      camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    });
    scrimpResize.observe(wrapper);
  }

  // =========================================================================
  // 8. 3D HOLOGRAPHIC SKILL RADAR (Canvas 2D Animated Visualization)
  // =========================================================================
  function initSkillRadar() {
    const canvas = document.getElementById('skill-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const skills = [
      { name: 'NET', val: 0.68 },
      { name: 'SEC', val: 0.66 },
      { name: 'WEB', val: 0.64 },
      { name: 'LNX', val: 0.42 },
      { name: 'PY', val: 0.39 }
    ];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let angleOffset = 0;

    function renderRadar() {
      requestAnimationFrame(renderRadar);
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - 24;

      ctx.clearRect(0, 0, w, h);
      angleOffset += 0.005;

      const numSides = skills.length;
      const step = (Math.PI * 2) / numSides;

      // Draw concentric radar grids
      [0.33, 0.66, 1.0].forEach((scale) => {
        ctx.beginPath();
        for (let i = 0; i < numSides; i++) {
          const angle = i * step - Math.PI / 2;
          const x = cx + Math.cos(angle) * (radius * scale);
          const y = cy + Math.sin(angle) * (radius * scale);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = scale === 1.0 ? 'rgba(98, 232, 238, 0.25)' : 'rgba(98, 232, 238, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Radar Spokes
      for (let i = 0; i < numSides; i++) {
        const angle = i * step - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(98, 232, 238, 0.15)';
        ctx.stroke();

        ctx.font = '500 8px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#7a8e93';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lx = cx + Math.cos(angle) * (radius + 14);
        const ly = cy + Math.sin(angle) * (radius + 14);
        ctx.fillText(skills[i].name, lx, ly);
      }

      // Draw Skill Value Polygon
      ctx.beginPath();
      skills.forEach((s, i) => {
        const angle = i * step - Math.PI / 2;
        const x = cx + Math.cos(angle) * (radius * s.val);
        const y = cy + Math.sin(angle) * (radius * s.val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      ctx.fillStyle = 'rgba(201, 240, 74, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#c9f04a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vertex dots
      skills.forEach((s, i) => {
        const angle = i * step - Math.PI / 2;
        const x = cx + Math.cos(angle) * (radius * s.val);
        const y = cy + Math.sin(angle) * (radius * s.val);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#62e8ee';
        ctx.fill();
      });

      // Rotating Scan Beam
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleOffset);
      const gradient = ctx.createLinearGradient(0, 0, radius, 0);
      gradient.addColorStop(0, 'rgba(201, 240, 74, 0)');
      gradient.addColorStop(1, 'rgba(201, 240, 74, 0.35)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, -0.2, 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    renderRadar();
  }

  // =========================================================================
  // 9. INTERACTIVE CYBER TERMINAL OVERLAY
  // =========================================================================
  function initTerminal() {
    const modal = document.getElementById('terminal-modal');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const toggleBtns = document.querySelectorAll('.open-terminal-btn');
    const closeBtn = document.getElementById('close-term');

    if (!modal || !input || !output) return;

    function openTerminal() {
      modal.classList.add('open');
      input.focus();
      playCyberSound('click');
    }

    function closeTerminal() {
      modal.classList.remove('open');
      playCyberSound('click');
    }

    toggleBtns.forEach(b => b.addEventListener('click', openTerminal));
    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeTerminal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || (e.key === '~' && !modal.classList.contains('open'))) {
        e.preventDefault();
        modal.classList.contains('open') ? closeTerminal() : openTerminal();
      } else if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeTerminal();
      }
    });

    const commands = {
      help: () => `AVAILABLE CYBER COMMANDS:\n  <span class="lime">about</span>     - View operator background & status\n  <span class="lime">skills</span>    - List capabilities & proficiency metrics\n  <span class="lime">scrimp</span>    - Display SCRIMP project architecture\n  <span class="lime">edu</span>       - Education & certification records\n  <span class="lime">contact</span>   - Retrieve verified channels & email\n  <span class="lime">scan</span>      - Run security surface diagnostic\n  <span class="lime">core</span>      - Switch 3D Core Mode [shield|scan|overclock]\n  <span class="lime">audio</span>     - Toggle procedural synth [on|off]\n  <span class="lime">clear</span>     - Clear terminal buffer\n  <span class="lime">exit</span>      - Close terminal HUD`,
      about: () => `OPERATOR IDENTITY:\n  Name: Naveen Sri T\n  Role: Ethical Hacker · Cybersecurity Engineering Student\n  College: Sri Shakthi Institute of Engineering and Technology (2025-2029)\n  Location: Coimbatore, India\n  Status: AVAILABLE FOR COLLABORATION`,
      skills: () => `TOOLKIT & PROFICIENCY:\n  - Networking Infrastructure: 68%\n  - Cybersecurity Fundamentals: 66%\n  - Web Surface (HTML/CSS/JS): 64%\n  - Linux Operating Systems: 42%\n  - Python Automation: 39%`,
      scrimp: () => `PROJECT / SCRIMP:\n  Smart Cyber Incident Response & Recovery Portal\n  Architecture: Identify -> Recover -> Digital Evidence Preservation -> Authority Uplink\n  Status: Concept / In Active Development`,
      edu: () => `EDUCATION & CERTIFICATIONS:\n  - B.E. Cyber Security (2025-2029) | GPA: 8.0 / 80%\n  - Programming Foundations (Python, C, C++, Java) | IMF Computers`,
      contact: () => `SECURE CHANNELS:\n  - Email: <a class="lime" href="mailto:naveensri5302966@gmail.com">naveensri5302966@gmail.com</a>\n  - Phone: <a class="cyan" href="tel:8248751761">+91 82487 51761</a>\n  - LinkedIn: <a class="lime" href="https://www.linkedin.com/in/naveen-sri-23448741b" target="_blank">linkedin.com/in/naveen-sri-23448741b</a>`,
      scan: () => {
        playCyberSound('scan');
        return `[DIAGNOSTIC RUNNING...]\n  [+] WebGL 3D Surface: ACTIVE (60 FPS)\n  [+] Memory Heap: SECURE\n  [+] Network Encryption: TLS 1.3 / Verified\n  [+] Threat Level: 0.00 [ALL SYSTEMS NOMINAL]`;
      },
      clear: () => {
        output.innerHTML = '';
        return '';
      },
      exit: () => {
        closeTerminal();
        return 'Terminal session closed.';
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = input.value.trim();
        input.value = '';
        if (!raw) return;

        const parts = raw.toLowerCase().split(' ');
        const cmd = parts[0];
        const arg = parts[1];

        const line = document.createElement('div');
        line.innerHTML = `<span class="dim">[root@nst-cyber ~]#</span> <span class="lime">${raw}</span>`;
        output.appendChild(line);

        let response = '';
        if (cmd === 'core' && arg) {
          if (['shield', 'scan', 'overclock'].includes(arg)) {
            const btn = document.querySelector(`.mode-btn[data-mode="${arg}"]`);
            if (btn) btn.click();
            response = `3D Core mode transitioned to: <span class="cyan">${arg.toUpperCase()}</span>`;
          } else {
            response = `<span class="muted">Invalid mode. Use: shield | scan | overclock</span>`;
          }
        } else if (cmd === 'audio' && arg) {
          if (arg === 'on') {
            initAudio();
            state.audioEnabled = true;
            if (audioToggleBtn) audioToggleBtn.innerHTML = '🔊';
            response = `Cyber Audio Synthesizer: <span class="lime">ENABLED</span>`;
          } else if (arg === 'off') {
            state.audioEnabled = false;
            if (audioToggleBtn) audioToggleBtn.innerHTML = '🔇';
            response = `Cyber Audio Synthesizer: <span class="muted">DISABLED</span>`;
          }
        } else if (commands[cmd]) {
          response = commands[cmd]();
        } else {
          response = `<span class="muted">Command not recognized: '${cmd}'. Type '<span class="lime">help</span>' for menu.</span>`;
        }

        if (response) {
          const resElem = document.createElement('div');
          resElem.className = 'term-output';
          resElem.innerHTML = response;
          output.appendChild(resElem);
        }

        output.scrollTop = output.scrollHeight;
        playCyberSound('hover');
      }
    });
  }

  // =========================================================================
  // 10. SCROLL REVEAL OBSERVERS & ACTIVE NAVIGATION
  // =========================================================================
  function initScrollBehavior() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .skill-row').forEach((el) => observer.observe(el));

    const sections = document.querySelectorAll('section[id]');
    const railLinks = document.querySelectorAll('.rail-index a');
    const navLinks = document.querySelectorAll('.top nav a');

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.find((e) => e.isIntersecting);
      if (!visible) return;
      const id = visible.target.id;

      railLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
      navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }, { rootMargin: '-25% 0px -50%' });

    sections.forEach((s) => sectionObserver.observe(s));

    const menuBtn = document.querySelector('.menu');
    const topNav = document.querySelector('.top nav');
    if (menuBtn && topNav) {
      menuBtn.addEventListener('click', () => {
        topNav.classList.toggle('open');
      });
      topNav.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => topNav.classList.remove('open'));
      });
    }

    const copyBtn = document.getElementById('copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('naveensri5302966@gmail.com');
          copyBtn.innerHTML = 'COPIED TO CLIPBOARD <span class="lime">✓</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy Email</span> <span>›</span>';
          }, 2000);
        } catch (e) {
          copyBtn.textContent = 'EMAIL: naveensri5302966@gmail.com';
        }
      });
    }

    const yearElem = document.getElementById('year');
    if (yearElem) {
      yearElem.textContent = new Date().getFullYear();
    }
  }

  // =========================================================================
  // 11. INITIALIZATION DISPATCHER
  // =========================================================================
  function init() {
    initBackground3D();
    initHero3DCore();
    initScrimp3D();
    initSkillRadar();
    initTerminal();
    initScrollBehavior();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
