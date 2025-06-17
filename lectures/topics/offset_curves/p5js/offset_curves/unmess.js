var unmess = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // unmess.ts
  var unmess_exports = {};
  __export(unmess_exports, {
    HOLE_AGGRESSIVE: () => HOLE_AGGRESSIVE,
    HOLE_EVENODD: () => HOLE_EVENODD,
    HOLE_NONE: () => HOLE_NONE,
    HOLE_NONZERO: () => HOLE_NONZERO,
    unmess: () => unmess
  });
  var HOLE_NONE = 0;
  var HOLE_AGGRESSIVE = 1;
  var HOLE_NONZERO = 2;
  var HOLE_EVENODD = 3;
  function disturb(poly, epsilon = 1e-4) {
    for (let j = 0; j < poly.length; j++) {
      poly[j][0] += (Math.random() * 2 - 1) * epsilon;
      poly[j][1] += (Math.random() * 2 - 1) * epsilon;
    }
  }
  function seg_isect(p0x, p0y, p1x, p1y, q0x, q0y, q1x, q1y, is_ray = false) {
    let d0x = p1x - p0x;
    let d0y = p1y - p0y;
    let d1x = q1x - q0x;
    let d1y = q1y - q0y;
    let vc = d0x * d1y - d0y * d1x;
    if (vc == 0) {
      return null;
    }
    let vcn = vc * vc;
    let q0x_p0x = q0x - p0x;
    let q0y_p0y = q0y - p0y;
    let vc_vcn = vc / vcn;
    let t = (q0x_p0x * d1y - q0y_p0y * d1x) * vc_vcn;
    let s = (q0x_p0x * d0y - q0y_p0y * d0x) * vc_vcn;
    if (0 <= t && (is_ray || t < 1) && 0 <= s && s < 1) {
      let ret = {t, s, side: null, other: null, xy: null};
      ret.xy = [p1x * t + p0x * (1 - t), p1y * t + p0y * (1 - t)];
      ret.side = pt_in_pl(p0x, p0y, p1x, p1y, q0x, q0y) < 0 ? 1 : -1;
      return ret;
    }
    return null;
  }
  function pt_in_pl(x, y, x0, y0, x1, y1) {
    let dx = x1 - x0;
    let dy = y1 - y0;
    let e = (x - x0) * dy - (y - y0) * dx;
    return e;
  }
  
  function build_vertices(poly, searchPercent) {
    let out = [];
    let n = poly.length;
    let nFrac = min(int(n/2), max(1, int(n*searchPercent)));
    
    var jlo = 0; 
    var jhi = n; 
    var bUseSearchPercent = true;
    
    for (let i = 0; i < n; i++) {
      let p = {xy: poly[i], isects: [], isects_map: {}};
      let i1 = (i + 1 + n) % n;
      let a = poly[i];
      let b = poly[i1];
      
      if (bUseSearchPercent){
        jlo = (i-nFrac);
        jhi = (i+nFrac);
      }
      
      for (let j = jlo; j < jhi; j++) {
        let jj = (j + n)%n; 
        let j1 = (jj + 1 + n) % n;
        if (i == jj || i == j1 || i1 == jj || i1 == j1) {
          continue;
        }
        let c = poly[jj];
        let d = poly[j1];
        let xx;
        if (out[jj]) {
          let ox = out[jj].isects_map[i];
          if (ox) {
            xx = {
              t: ox.s,
              s: ox.t,
              xy: ox.xy,
              other: null,
              side: pt_in_pl(...a, ...b, ...c) < 0 ? 1 : -1
            };
          }
        } else {
          xx = seg_isect(...a, ...b, ...c, ...d);
        }
        if (xx) {
          xx.other = jj;
          p.isects.push(xx);
          p.isects_map[jj] = xx;
        }
      }
      
        
        /*
        for (let j = 0; j < n; j++) {
          let j1 = (j + 1 + n) % n;
          if (i == j || i == j1 || i1 == j || i1 == j1) {
            continue;
          }
          let c = poly[j];
          let d = poly[j1];
          let xx;
          if (out[j]) {
            let ox = out[j].isects_map[i];
            if (ox) {
              xx = {
                t: ox.s,
                s: ox.t,
                xy: ox.xy,
                other: null,
                side: pt_in_pl(...a, ...b, ...c) < 0 ? 1 : -1
              };
            }
          } else {
            xx = seg_isect(...a, ...b, ...c, ...d);
          }
          if (xx) {
            xx.other = j;
            p.isects.push(xx);
            p.isects_map[j] = xx;
          }
        }
        */
      
        
      
      
      p.isects.sort((a2, b2) => a2.t - b2.t);
      out.push(p);
    }
    return out;
  }
  function mirror_isects(verts) {
    let imap = {};
    let n = verts.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < verts[i].isects.length; j++) {
        let id = pair_key(i, j);
        let k = verts[i].isects[j].other;
        let z = verts[k].isects.findIndex((x) => x.other == i);
        imap[id] = [k, z];
      }
    }
    return imap;
  }
  function poly_area(poly) {
    var n = poly.length;
    var a = 0;
    for (var p = n - 1, q = 0; q < n; p = q++) {
      a += poly[p][0] * poly[q][1] - poly[q][0] * poly[p][1];
    }
    return a * 0.5;
  }
  function check_concavity(poly, idx) {
    let n = poly.length;
    let a = poly[(idx - 1 + n) % n];
    let b = poly[idx];
    let c = poly[(idx + 1) % n];
    let cw = pt_in_pl(...a, ...b, ...c) < 0 ? 1 : -1;
    return cw;
  }
  function ray_isect_poly(x0, y0, x1, y1, poly) {
    let n = poly.length;
    let isects = [];
    for (let i = 0; i < poly.length; i++) {
      let a = poly[i];
      let b = poly[(i + 1) % n];
      let xx = seg_isect(x0, y0, x1, y1, ...a, ...b, true);
      if (xx) {
        isects.push(xx);
      }
    }
    isects.sort((a, b) => a.t - b.t);
    return isects;
  }
  function poly_is_hole(hole, poly, verify_winding = true, eps = 1e-4) {
    let ar = poly_area(hole);
    hole = ar > 0 ? hole.slice().reverse() : hole.slice();
    let i;
    for (i = 0; i < hole.length; i++) {
      if (check_concavity(hole, i) < 0) {
        break;
      }
    }
    if (i >= hole.length) {
      return false;
    }
    let a = hole[(i - 1 + hole.length) % hole.length];
    let b = hole[i];
    let c = hole[(i + 1) % hole.length];
    let m = [a[0] * 0.5 + c[0] * 0.5, a[1] * 0.5 + c[1] * 0.5];
    let dx = m[0] - b[0];
    let dy = m[1] - b[1];
    let l = Math.sqrt(dx * dx + dy * dy);
    let ux = b[0] + dx / l * eps;
    let uy = b[1] + dy / l * eps;
    let isects = ray_isect_poly(ux, uy, m[0], m[1], poly);
    let ok = isects.length % 2 == 0;
    if (verify_winding && ok) {
      let wind = 0;
      for (let j = 0; j < isects.length; j++) {
        wind += isects[j].side;
      }
      ok = ok && wind == 0;
    }
    return ok;
  }
  function pair_key(i, j) {
    return i + "," + j;
  }
  function quad_key(i, j, k, z) {
    return i + "," + j + "," + k + "," + z;
  }
  function unmess(poly, args = {}) {
    var _a, _b, _c, _d;
    (_a = args.disturb) != null ? _a : args.disturb = 1e-4;
    (_b = args.epsilon) != null ? _b : args.epsilon = 1e-4;
    (_c = args.hole_policy) != null ? _c : args.hole_policy = HOLE_AGGRESSIVE;
    (_d = args.search_percent) != null ? _d : args.search_percent = 0.1;
    
    if (poly.length <= 3) {
      return [poly];
    }
    if (args.disturb) {
      disturb(poly, args.disturb);
    }
    
    let searchPercent = 0.1; 
    if (args.search_percent){
      searchPercent = args.search_percent;
    }
    
    let verts = build_vertices(poly, searchPercent);
    let isect_mir = mirror_isects(verts);
    let n = poly.length;
    let used = {};
    let used_isects = {};
    let used_edges = {};
    function trace_outline(i0, j0, dir, is_outline, force_no_backturn = false) {
      let local_used = {};
      let local_used_isects = {};
      let local_used_edges = {};
      let zero = null;
      let out2 = [];
      function trace_from(i02, j02, dir2, prev) {
        if (zero == null) {
          zero = [i02, j02];
        } else if (i02 == zero[0] && j02 == zero[1]) {
          return true;
        } else if (zero[1] != -1 && j02 != -1) {
          let q = verts[i02].isects[j02];
          if (q) {
            let k = q.other;
            let z = verts[k].isects.findIndex((x) => x.other == i02);
            if (k == zero[0] && z == zero[1]) {
              return true;
            }
          }
        }
        if (args.hole_policy != HOLE_AGGRESSIVE && prev) {
          let edge_id = quad_key(...prev, i02, j02);
          if (used_edges[edge_id]) {
            return false;
          }
          local_used_edges[edge_id] = true;
        }
        let p = verts[i02];
        let i1 = (i02 + dir2 + n) % n;
        if (j02 == -1) {
          if (args.hole_policy != HOLE_EVENODD && (!is_outline && (used[i02] || local_used[i02]))) {
            return false;
          }
          local_used[i02] = true;
          out2.push(p.xy);
          if (dir2 < 0) {
            return trace_from(i1, verts[i1].isects.length - 1, dir2, [i02, j02]);
          } else if (!verts[i02].isects.length) {
            return trace_from(i1, -1, dir2, [i02, j02]);
          } else {
            return trace_from(i02, 0, dir2, [i02, j02]);
          }
        } else if (j02 >= p.isects.length) {
          return trace_from(i1, -1, dir2, [i02, j02]);
        } else {
          let id = pair_key(i02, j02);
          if (args.hole_policy == HOLE_AGGRESSIVE && !is_outline && (used_isects[id] || local_used_isects[id])) {
            return false;
          }
          local_used_isects[id] = true;
          out2.push(p.isects[j02].xy);
          let q = p.isects[j02];
          let [k, z] = isect_mir[id];
          local_used_isects[pair_key(k, z)] = true;
          let params;
          if (q.side * dir2 < 0) {
            params = [k, z - 1, -1];
          } else {
            params = [k, z + 1, 1];
          }
          if ((args.hole_policy == HOLE_AGGRESSIVE || force_no_backturn) 
              && !is_outline && params[2] != dir2) {
            return false;
          }
          return trace_from(...params, [i02, j02]);
        }
      }
      let success = trace_from(i0, j0, dir, null);
      if (!success || out2.length < 3) {
        return null;
      }
      return {
        poly: out2,
        used: local_used,
        used_isects: local_used_isects,
        used_edges: local_used_edges
      };
    }
    let xmin = Infinity;
    let amin = 0;
    for (let i = 0; i < n; i++) {
      if (poly[i][0] < xmin) {
        xmin = poly[i][0];
        amin = i;
      }
    }
    let cw = check_concavity(poly, amin);
    let out = [];
    let ret = trace_outline(amin, -1, cw, true);
    if (!ret) {
      return [];
    }
    used = ret.used;
    used_isects = ret.used_isects;
    out.push(ret.poly);
    if (args.hole_policy != HOLE_NONE) {
      let hole_starts = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < verts[i].isects.length; j++) {
          let id = pair_key(i, j);
          let kz = pair_key(...isect_mir[id]);
          if (args.hole_policy != HOLE_AGGRESSIVE || !used_isects[id] && !used_isects[kz]) {
            hole_starts.push([i, j]);
          }
        }
      }
      for (let i = 0; i < hole_starts.length; i++) {
        let [k, z] = hole_starts[i];
        let ret2 = trace_outline(k, z, cw, false);
        if (ret2) {
          let ok = poly_is_hole(ret2.poly, poly, args.hole_policy != HOLE_EVENODD, args.epsilon);
          if (ok) {
            out.push(ret2.poly);
            Object.assign(used, ret2.used);
            Object.assign(used_isects, ret2.used_isects);
            Object.assign(used_edges, ret2.used_edges);
          }
        }
      }
      if (args.hole_policy == HOLE_EVENODD) {
        for (let i = 0; i < hole_starts.length; i++) {
          let [k, z] = hole_starts[i];
          let ret2 = trace_outline(k, z, -cw, false, true);
          if (ret2) {
            let ok = poly_is_hole(ret2.poly, poly, false, args.epsilon);
            if (ok) {
              out.push(ret2.poly);
              Object.assign(used, ret2.used);
              Object.assign(used_isects, ret2.used_isects);
              Object.assign(used_edges, ret2.used_edges);
            }
          }
        }
      }
    }
    return out;
  }
  return unmess_exports;
})();
;(typeof module == 'object')?(module.exports=unmess):0;