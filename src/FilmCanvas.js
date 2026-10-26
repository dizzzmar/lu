// Authored WebGL film surface: subdivided stills flex with scroll velocity.
// The DOM images remain the fallback when WebGL or reduced-motion requires it.
const vertex = `
precision mediump float;
attribute vec2 aPosition;
uniform vec2 uViewport;
uniform vec4 uRect;
uniform float uBend;
uniform float uProgress;
varying mediump vec2 vUv;
void main(){
  vUv=vec2(aPosition.x,1.0-aPosition.y);
  vec2 p=aPosition;
  float arch=sin(p.y*3.14159265);
  float curve=sin(p.x*3.14159265);
  float edge=abs(uProgress)*0.018;
  p.x=0.5+(p.x-0.5)*(1.0-edge-uBend*arch*0.024);
  p.y+=uBend*curve*curve*0.045;
  vec2 pixel=uRect.xy+p*uRect.zw;
  gl_Position=vec4(pixel.x/uViewport.x*2.0-1.0,1.0-pixel.y/uViewport.y*2.0,0.0,1.0);
}`;
const fragment = `
precision mediump float;
uniform sampler2D uImage;
uniform vec2 uImageSize;
uniform vec2 uSize;
uniform float uRadius;
uniform float uProgress;
varying mediump vec2 vUv;
void main(){
  vec2 uv=vUv;
  float imageAspect=uImageSize.x/uImageSize.y;
  float boxAspect=uSize.x/uSize.y;
  if(imageAspect>boxAspect) uv.x=(uv.x-.5)*boxAspect/imageAspect+.5;
  else uv.y=(uv.y-.5)*imageAspect/boxAspect+.5;
  uv=(uv-.5)*.90+.5;
  uv.y+=uProgress*.035;
  vec3 color=texture2D(uImage,clamp(uv,0.001,0.999)).rgb;
  vec2 q=abs((vUv-.5)*uSize)-(uSize*.5-uRadius);
  float distance=length(max(q,0.0))+min(max(q.x,q.y),0.0)-uRadius;
  float alpha=1.0-smoothstep(-1.1,.6,distance);
  gl_FragColor=vec4(color,alpha);
}`;
export function createFilmCanvas(canvas, images, onReady) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;
  const resources = [];
  function shader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(s));
    resources.push(["shader", s]);
    return s;
  }
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const points = [];
  const steps = 28;
  for (let y = 0; y < steps; y++)
    for (let x = 0; x < steps; x++) {
      const a = x / steps,
        b = y / steps,
        c = (x + 1) / steps,
        d = (y + 1) / steps;
      points.push(a, b, c, b, a, d, a, d, c, b, c, d);
    }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  const attr = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);
  const uniform = Object.fromEntries(
    [
      "uViewport",
      "uRect",
      "uBend",
      "uProgress",
      "uImage",
      "uImageSize",
      "uSize",
      "uRadius",
    ].map((key) => [key, gl.getUniformLocation(program, key)]),
  );
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  let disposed = false;
  let textures = [];
  let ready = false;
  const load = images.map(
    (el, i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (disposed) return resolve();
          const texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img,
          );
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          textures[i] = { texture, width: img.width, height: img.height };
          resolve();
        };
        img.onerror = () => resolve();
        img.src = el.src;
      }),
  );
  Promise.all(load).then(() => {
    if (!disposed && textures.filter(Boolean).length === images.length) {
      ready = true;
      onReady();
    }
  });
  let width = 0,
    height = 0;
  return {
    draw(rects, bend) {
      if (!ready || disposed) return;
      const w = innerWidth,
        h = innerHeight,
        ratio = Math.min(devicePixelRatio || 1, 1.5);
      if (width !== w || height !== h) {
        width = w;
        height = h;
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniform.uViewport, w, h);
      gl.uniform1f(uniform.uBend, bend);
      gl.uniform1i(uniform.uImage, 0);
      rects.forEach((r, i) => {
        if (r.bottom < -100 || r.top > h + 100) return;
        const t = textures[i];
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, t.texture);
        gl.uniform4f(uniform.uRect, r.left, r.top, r.width, r.height);
        gl.uniform2f(uniform.uImageSize, t.width, t.height);
        gl.uniform2f(uniform.uSize, r.width, r.height);
        gl.uniform1f(uniform.uRadius, w < 700 ? 22 : 48);
        gl.uniform1f(
          uniform.uProgress,
          Math.max(-1, Math.min(1, (r.top + r.height * 0.5 - h * 0.5) / h)),
        );
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
      });
    },
    destroy() {
      disposed = true;
      textures.forEach((t) => t && gl.deleteTexture(t.texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      resources.forEach(([, s]) => gl.deleteShader(s));
    },
  };
}
