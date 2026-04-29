// engine.js — 4x4 checkers game engine
// Pieces: 0=empty, 1=red, 2=white, 3=red_king, 4=white_king
// Red starts at rows 2-3 (bottom), moves up (dr=-1)
// White starts at rows 0-1 (top), moves down (dr=+1)

export const EMPTY=0, RED=1, WHITE=2, RED_K=3, WHITE_K=4;

export function isRed(p)      { return p===RED||p===RED_K; }
export function isWhite(p)    { return p===WHITE||p===WHITE_K; }
export function isKing(p)     { return p===RED_K||p===WHITE_K; }
export function belongsTo(p,t){ return t===RED ? isRed(p) : isWhite(p); }
export function isEnemy(p,t)  { return t===RED ? isWhite(p) : isRed(p); }
export function opponent(t)   { return t===RED ? WHITE : RED; }

export function initBoard() {
  const b = Array(4).fill(null).map(()=>Array(4).fill(EMPTY));
  b[0][0]=WHITE; b[0][1]=WHITE; b[0][2]=WHITE; b[0][3]=WHITE;
  b[3][0]=RED;   b[3][1]=RED;   b[3][2]=RED;   b[3][3]=RED;
  return b;
}

export function cloneBoard(b) {
  return b.map(r=>[...r]);
}

function fwdDirs(p, t) {
  if (isKing(p)) return [-1, 1];
  return [t===RED ? -1 : 1];
}

// Returns [{r, c, capR, capC}]
// Normal move: straight forward, capR/capC = null
// Capture: diagonal onto enemy square, capR/capC = that square
export function getMovesForPiece(b, r, c, t) {
  const p = b[r][c];
  const moves = [];
  for (const dr of fwdDirs(p, t)) {
    // Straight move
    const nr = r+dr;
    if (nr>=0 && nr<4 && b[nr][c]===EMPTY)
      moves.push({ r:nr, c:c, capR:null, capC:null });
    // Diagonal captures
    for (const dc of [-1, 1]) {
      const nc = c+dc;
      if (nr>=0 && nr<4 && nc>=0 && nc<4 && isEnemy(b[nr][nc], t))
        moves.push({ r:nr, c:nc, capR:nr, capC:nc });
    }
  }
  return moves;
}

export function getAllMoves(b, t) {
  const all = [];
  for (let r=0; r<4; r++)
    for (let c=0; c<4; c++)
      if (belongsTo(b[r][c], t))
        getMovesForPiece(b,r,c,t).forEach(m => all.push({...m, fromR:r, fromC:c}));
  return all;
}

export function getLegalMoves(b, t) {
  const all = getAllMoves(b, t);
  const caps = all.filter(m => m.capR !== null);
  return caps.length > 0 ? caps : all; // mandatory capture
}

export function applyMove(b, fromR, fromC, toR, toC, capR, capC) {
  const nb = cloneBoard(b);
  if (capR !== null) nb[capR][capC] = EMPTY; // remove enemy first
  nb[toR][toC] = nb[fromR][fromC];
  nb[fromR][fromC] = EMPTY;
  if (nb[toR][toC]===RED   && toR===0) nb[toR][toC] = RED_K;
  if (nb[toR][toC]===WHITE && toR===3) nb[toR][toC] = WHITE_K;
  return nb;
}

export function countPieces(b) {
  let r=0, w=0;
  for (let i=0;i<4;i++) for (let j=0;j<4;j++) {
    if (isRed(b[i][j]))   r++;
    if (isWhite(b[i][j])) w++;
  }
  return { red:r, white:w };
}

// Returns RED, WHITE, or null if game ongoing
export function checkWinner(b) {
  const {red, white} = countPieces(b);
  if (red===0)   return WHITE;
  if (white===0) return RED;
  if (getLegalMoves(b, RED).length===0)   return WHITE;
  if (getLegalMoves(b, WHITE).length===0) return RED;
  return null;
}

// Simple AI for Dobot (WHITE): prefer captures, else random move
export function chooseDobotMove(b) {
  const legal = getLegalMoves(b, WHITE);
  if (legal.length===0) return null;
  const caps = legal.filter(m => m.capR !== null);
  const pool = caps.length > 0 ? caps : legal;
  // pick move that advances most (lowest toR = furthest down toward row 3)
  pool.sort((a,b) => b.r - a.r);
  return pool[0];
}

// Parse API response board into engine format
// Expects {board: [["red","white",...], ...]}
const NAME_MAP = { empty:EMPTY, red:RED, white:WHITE, red_king:RED_K, white_king:WHITE_K };
export function parseAPIBoard(data) {
  if (!data?.board || data.board.length!==4) return null;
  try {
    return data.board.map(row => row.map(cell => NAME_MAP[cell] ?? EMPTY));
  } catch { return null; }
}

// Infer human (RED) move by comparing previous board to newly detected board
export function inferHumanMove(prev, next) {
  let from=null, to=null;
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) {
    if (isRed(prev[r][c]) && !isRed(next[r][c])) from = {r,c};
    if (!isRed(prev[r][c]) && isRed(next[r][c]))  to   = {r,c};
  }
  if (!from || !to) return null;
  const legal = getMovesForPiece(prev, from.r, from.c, RED);
  const match = legal.find(m => m.r===to.r && m.c===to.c);
  if (!match) return null;
  return { fromR:from.r, fromC:from.c, r:to.r, c:to.c, capR:match.capR, capC:match.capC };
}

export function boardToJSON(b) {
  const names = ['empty','red','white','red_king','white_king'];
  return b.map(row => row.map(p => names[p]));
}
