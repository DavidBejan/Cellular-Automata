"use strict"


/*	----------------------------------
	CONFIGURATION SETTINGS
	----------------------------------
*/
let normal_vol = 200;
let config = {

	// Grid settings
	ndim : 2,
	field_size : [200,200],
	
	// CPM parameters and configuration
	conf : {
		// Basic CPM parameters
		torus : [true,true],				// Should the grid have linked borders?
		seed : 132,							// Seed for random number generation.
		T : 20,								// CPM temperature
		// Constraint parameters. 
		// Mostly these have the format of an array in which each element specifies the
		// parameter value for one of the cellkinds on the grid.
		// First value is always cellkind 0 (the background) and is often not used.
				
		// Adhesion parameters:
		J: [[0,20,20],
		[20, 20, 20],
		[20, 20, 0]],
		
		// VolumeConstraint parameters
		LAMBDA_V : [0, 100, 50],		// VolumeConstraint importance per cellkind
		V : [0, normal_vol/2, normal_vol],			// Target volume of each cellkind
		
		// PerimeterConstraint parameters
		LAMBDA_P: [0,16*(normal_vol/100),1*(normal_vol/100)],		// PerimeterConstraint importance per cellkind
		P : [0,32*(normal_vol/100),90*(normal_vol/100)],			// Target perimeter of each cellkind
		
		// ActivityConstraint parameters
		LAMBDA_ACT : [0, 0, 100],				// ActivityConstraint importance per cellkind
		MAX_ACT : [0, 0, 30],					// Activity memory duration per cellkind
		ACT_MEAN : "geometric"	
		

	},
	
	// Simulation setup and configuration
	simsettings : {
	
		// Cells on the grid
		NRCELLS : [2, 2],					// Number of cells to seed for all
		// non-background cellkinds.
		// Runtime etc
		BURNIN : 500,
		RUNTIME : 1000,
		RUNTIME_BROWSER : "Inf",
		
		// Visualization
		CANVASCOLOR : "eaecef",
		CELLCOLOR : ["00FF00", "990000"],
		ACTCOLOR : [true],					// Should pixel activity values be displayed?
		SHOWBORDERS : [true, true],				// Should cellborders be displayed?
		
		// Output images
		SAVEIMG : true,					// Should a png image of the grid be saved
		// during the simulation?
		IMGFRAMERATE : 1,					// If so, do this every <IMGFRAMERATE> MCS.
		SAVEPATH : "C:\Users\David\Desktop\Cellular Automata Assigment\stuff saved",	// ... And save the image in this folder.
		EXPNAME : "SingleCell",				// Used for the filename of output images.
		
		// Output stats etc
		STATSOUT : { browser: true, node: true }, // Should stats be computed?
		LOGRATE : 10							// Output stats every <LOGRATE> MCS.

	}
}
/*	---------------------------------- */
let sim, meter


function parameter() {
        config.simsettings.NRCELLS[0] = document.getElementById('numobst').value;
        config.simsettings.NRCELLS[1] = document.getElementById('numcells').value;
        config.simsettings.CELLCOLOR[1] = '6305fb';
        config.conf.MAX_ACT[2] = 80;  
    
    
}

function initialize(){
        parameter();
        let rearangeOBS = {
    ObstacleGrid : ObstacleGrid
  }
	sim = new CPM.Simulation(config, rearangeOBS )
        meter = new FPSMeter({left:"auto", right:"5px"})
	step();
}


function step(){
	sim.step()
	meter.tick()
	if( sim.conf["RUNTIME_BROWSER"] == "Inf" | sim.time+1 < sim.conf["RUNTIME_BROWSER"] ){
		requestAnimationFrame( step )
	}
}


function ObstacleGrid(){
  if (!this.helpClasses["gm"]){ this.addGridManipulator() }

  let obstacles = Number(this.conf.NRCELLS[0]);
  if (obstacles > 0) {
    let pad = 20;
    let width = this.C.extents[0]; let height = this.C.extents[1];
    let xStep = (width -pad*2) / (Math.ceil(Math.sqrt(obstacles))-1);
    let yStep = (height -pad*2) / (Math.ceil(Math.sqrt(obstacles))-1);
    let seededObstacles = 0
    for (let y=pad; y<height; y+=yStep) {
      for (let x=pad; x<width; x+=xStep) {
        if (seededObstacles++ >= obstacles)
          break;
        this.gm.seedCellAt(1, [Math.floor(x), Math.floor(y)]);
      }
    }
  }

  // Randomly seed the moving cells
  for (let i=0; i<Number(this.conf.NRCELLS[1]); i++) {
    this.gm.seedCell(2)
  }
}