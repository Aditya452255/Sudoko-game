const gridEl = document.getElementById('grid');
const statusText = document.getElementById('statusText');
const generateBtn = document.getElementById('generate');
const solveBtn = document.getElementById('solve');
const clearBtn = document.getElementById('clear');
const removeInput = document.getElementById('remove');
const givenCountEl = document.getElementById('givenCount');
const timerEl = document.getElementById('timer');
const scoreValue = document.getElementById('scoreValue');

let timerInterval = null;
let seconds = 0;

function startTimer(){
  clearInterval(timerInterval);
  seconds = 0;
  timerEl.textContent = '00:00';
  timerInterval = setInterval(()=>{
    seconds++;
    const m = String(Math.floor(seconds/60)).padStart(2,'0');
    const s = String(seconds%60).padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
  },1000);
}

function stopTimer(){ clearInterval(timerInterval); timerInterval = null; }

function makeGrid(){
  gridEl.innerHTML = '';
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      const input = document.createElement('input');
      input.type = 'text'; input.maxLength = 1;
      input.dataset.r = r; input.dataset.c = c;
      input.addEventListener('input', ()=>{
        input.value = input.value.replace(/[^1-9]/g,'');
        input.classList.remove('fixed');
      });
      input.addEventListener('focus', ()=>{
        if(document.getElementById('neonGlow').checked)
          input.style.boxShadow = '0 6px 30px rgba(14,165,164,0.14)';
      });
      input.addEventListener('blur', ()=>{ input.style.boxShadow = ''; });
      cell.appendChild(input);
      gridEl.appendChild(cell);
    }
  }
  updateGivenCount();
}

function readGrid(){
  const rows = [];
  for(let r=0;r<9;r++){
    const row = [];
    for(let c=0;c<9;c++){
      const idx = r*9 + c;
      const v = gridEl.children[idx].firstChild.value;
      row.push(v === '' ? 0 : parseInt(v,10));
    }
    rows.push(row);
  }
  return rows;
}

function fillGrid(grid, fixed=false){
  for(let r=0;r<9;r++) for(let c=0;c<9;c++){
    const idx = r*9 + c;
    const input = gridEl.children[idx].firstChild;
    input.value = grid[r][c] === 0 ? '' : grid[r][c];
    if(fixed && grid[r][c] !== 0) input.classList.add('fixed');
  }
  updateGivenCount();
}

function updateGivenCount(){
  const rows = readGrid();
  let count = 0;
  rows.flat().forEach(v=>{ if(v!==0) count++; });
  givenCountEl.textContent = count;
}

// --- API: Generate Puzzle ---
generateBtn.addEventListener('click', async ()=>{
  const remove = parseInt(removeInput.value,10) || 40;
  statusText.textContent = 'Generating...';
  try{
    const res = await fetch(`/generate?remove=${remove}`,{ method:'POST' });
    const body = await res.json();
    fillGrid(body.puzzle,true);
    statusText.textContent = 'Generated';
    startTimer();
  }catch(e){ statusText.textContent = 'Error'; }
});

// --- API: Solve ---
solveBtn.addEventListener('click', async ()=>{
  const grid = readGrid();
  statusText.textContent = 'Solving...';
  try{
    const res = await fetch('/solve',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ grid })
    });
    const body = await res.json();
    if(res.ok){
      fillGrid(body.solution,false);
      statusText.textContent = 'Solved';
      stopTimer();
    } else {
      statusText.textContent = body.error || 'Error';
    }
  }catch(e){ statusText.textContent = 'Error'; }
});

// Clear Grid
clearBtn.addEventListener('click', ()=>{
  makeGrid();
  statusText.textContent = 'Cleared';
  stopTimer();
  scoreValue.textContent = '0';
});

// Hint (fills the first empty cell)
document.getElementById('hintBtn').addEventListener('click', ()=>{
  statusText.textContent = 'Hinting...';
  fetch('/solve',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ grid: readGrid() })
  })
  .then(r=>r.json())
  .then(b=>{
    if(b.solution){
      for(let i=0;i<81;i++){
        const input = gridEl.children[i].firstChild;
        if(input.value === ''){
          input.value = b.solution[Math.floor(i/9)][i%9];
          break;
        }
      }
      statusText.textContent = 'Hint applied';
      updateGivenCount();
    } else statusText.textContent = 'No solution';
  })
  .catch(()=> statusText.textContent = 'Error');
});

// Update given count when editing grid
gridEl.addEventListener('input', ()=>{ updateGivenCount(); });

// Reset icon
document.getElementById('resetIcon').addEventListener('click', ()=>{
  makeGrid();
  statusText.textContent = 'Reset';
  stopTimer();
});

// --- Initialize ---
makeGrid();