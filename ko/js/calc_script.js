function showThisCal(idToShow, hide1, hide2, hide3) {
				document.getElementById(idToShow).style.display = "block"
				document.getElementById(hide1).style.display = "none"
				document.getElementById(hide2).style.display = "none"
				document.getElementById(hide3).style.display = "none"
			};
			
			function blurBackground(id){
				id.style.filter = "blur(8px)"
			}
			
			function unblurBackground(id){
				id.style.filter = "blur(0px)"
			}

			function getScore(cpuScore, gpuScore) {
				return Math.floor(1 / ((0.85 / gpuScore) + (0.15 / cpuScore)))
			}

			function getWattage(gpuwattage, cpuwattage, offset) {
				return gpuwattage + cpuwattage + (offset || 0)
			}

			function showAvailableRamSpeed(cpu, ramslist) {
				var speedList = Object.keys(data.procs[cpu]['1'])
				for (i = 0; i < ramslist.options.length; i++) {
					if (speedList.includes(ramslist.options[i].value) == false) {
						ramslist.options[i].style.display = 'none'
					} else {
						ramslist.options[i].style.display = 'block'
					}
				}
			}

			function showAvailableRamChannel(cpu, channellist) {
				for (i = 0; i < channellist.options.length; i++) {
					if (data.procs[cpu][channellist.options[i].value]) {
						channellist.options[i].style.display = "block"
					} else {
						channellist.options[i].style.display = "none"
					}
				}
			}

			function showAvailableMotherboard(cpuid, gpuid, slicf, motherboardlist,ramspeed) {
				for (mobo in motherboardlist.options) {
					if (mobo == "length" || mobo == "selectedIndex" || mobo == "add" || mobo == "remove" || mobo == "item" || mobo == "namedItem") {
						continue
					}
					if (data.procs[cpuid].socket == data.motherboards[motherboardlist.options[mobo].innerHTML].socket) {
						if (slicf == "1") {
							motherboardlist.options[mobo].style.display = "block"
						} else {
							if (data.motherboards[motherboardlist.options[mobo].innerHTML].multigpu != null && (data.motherboards[motherboardlist.options[mobo].innerHTML].multigpu).includes(data.gpus[gpuid].multigpu)) {
								motherboardlist.options[mobo].style.display = "block"
								if(data.motherboards[motherboardlist.options[mobo].innerHTML].speeds.includes(ramspeed) || Number(ramspeed) < data.motherboards[motherboardlist.options[mobo].innerHTML].maxspeed){
									motherboardlist.options[mobo].style.display = "block"
								}else{
									motherboardlist.options[mobo].style.display = "none"
								}
							} else {
								motherboardlist.options[mobo].style.display = "none"
							}
						}
					}else {
						motherboardlist.options[mobo].style.display = "none"
					}
				}
			}

			function scoreCalculatorCal() {
				var cpu = document.getElementById('scoreCForm').cpu1.value
				var rams = document.getElementById('scoreCForm').rams1.value
				var ramc = document.getElementById('scoreCForm').ramc1.value
				var gpu = document.getElementById('scoreCForm').gpu1.value
				var slicf = document.getElementById('scoreCForm').slicf1.value
				if (!data.procs[cpu] || data.procs[cpu][ramc][rams] == "") {
					alert("CPU를 찾을 수 없어요!")
				} else if (!data.gpus[gpu]) {
					alert("GPU를 찾을 수 없어요!")
				} else if (!data.gpus[gpu][slicf]) {
					alert("선택한 GPU는 SLI/CrossFire가 호환되지 않아요!")
				} else {
					var score = getScore(data.procs[cpu][ramc][rams], data.gpus[gpu][slicf].score)
					var wattage = getWattage(data.gpus[gpu][slicf].wattage, data.procs[cpu].wattage, 50)
					var cpuP = data.procs[cpu].price
					var cpuUP = data.procs[cpu].sellPrice
					var gpuP = data.gpus[gpu][slicf].price
					var gpuUP = data.gpus[gpu][slicf].sellPrice
					document.getElementById('cpuScoreResult1').innerText = data.procs[cpu][ramc][rams]
					document.getElementById('gpuScoreResult1').innerText = data.gpus[gpu][slicf].score
					document.getElementById('totalScoreResult1').innerText = score
					document.getElementById('wattageResult1').innerText = wattage
					document.getElementById('cpuPrice1').innerText = cpuP
					document.getElementById('cpuUsedPrice1').innerText = cpuUP
					document.getElementById('gpuPrice1').innerText = gpuP
					document.getElementById('gpuUsedPrice1').innerText = gpuUP
				}
				return [score, wattage, cpuP + gpuP]
			}

			function parts(proc, ramspeed, channel, gpu, slicf, mobo, ram, score, wattage, cost, budgetleft) {
				var build = {
					"processor": proc,
					"ramspeed": ramspeed,
					"channel": channel,
					"gpu": gpu,
					"slicf": slicf,
					"mobo": mobo,
					"ram": ram,
					"score": score,
					"wattage": wattage,
					"cost": cost,
					"budgetleft": budgetleft
				}
				return build
			}
			
			var temp
			
			function addSaveButton(target,id) {
				var button = document.createElement('BUTTON')
				button.id = id
				button.onclick = function() {
					blurBackground(document.getElementById('buildMaker'))
					blurBackground(document.getElementById('buildMakerResults'))
					showSaver(document.getElementById('saveBuildBackground'))
					temp = this.id
				}
				var text = document.createTextNode('저장')
				button.append(text)
				target.append(button)
			}
			
			function showSaver(id){
				id.style.display = "block"
			}
			
			function hideSaver(id){
				id.style.display = "none"
			}
			
			function savePcBuild(id,type,remarks){
				cpu = id.cells[0].innerHTML
				ramc = id.cells[1].innerHTML
				rams = id.cells[2].innerHTML
				gpu = id.cells[3].innerHTML
				slicf = id.cells[4].innerHTML
				mobo = id.cells[5].innerHTML
				ram = id.cells[6].innerHTML
				cost = id.cells[7].innerHTML
				budgetleft = id.cells[8].innerHTML
				wattage = id.cells[9].innerHTML
				score = id.cells[10].innerHTML
				type = type
				remarks = remarks
				saveBuild(cpu, ramc, rams, gpu, slicf, mobo, ram, cost, budgetleft, wattage, score, type, remarks)
			}

			function generateBuild() {
				var budget = Number(document.getElementById('buildForm').budget1.value)
				var resbudget = Number(document.getElementById('buildForm').resbudget1.value)
				var score = Number(document.getElementById('buildForm').score1.value)
				var offset = document.getElementById('buildForm').offset1.value
				var level = Number(document.getElementById('buildForm').level1.value)
				var results = Number(document.getElementById('buildForm').results1.value) || 10
				var architecture = document.getElementById('buildForm').architecture1.value
				var incmobo = document.getElementById('buildForm').incmobo1.checked
				var incram = document.getElementById('buildForm').incram1.checked
				var needoc = document.getElementById('buildForm').needoc1.checked
				var builds = []
				if (offset == "") {
					offset = 200
				} else {
					offset = Number(offset)
				}
				for (cpu in data.procs) {
					if (data.procs[cpu].level <= level) {
						if (needoc == true && data.procs[cpu].oc == "No") {
							continue
						}
						if (architecture == "skylake" && data.procs[cpu].type != "skylake") {
							continue
						} else if (architecture == "kabylake" && data.procs[cpu].type != "kabylake") {
							continue
						} else if (architecture == "coffeelake" && data.procs[cpu].type != "coffeelake") {
							continue
						} else if (architecture == "xseries" && data.procs[cpu].type != "xseries") {
							continue
						} else if (architecture == "ryzen" && data.procs[cpu].type != "ryzen") {
							continue
						} else if (architecture == "threadripper" && data.procs[cpu].type != "threadripper") {
							continue
						}
						for(ramchannel in data.procs[cpu]){
							if(ramchannel != "1" && ramchannel != "2" && ramchannel != "3" && ramchannel != "4"){
								continue
							}
							for(ramspeed in data.procs[cpu][ramchannel]){
								for(gpu in data.gpus){
									if(data.gpus[gpu].level > level){
										continue
									}
									for(slicf in data.gpus[gpu]){
										if(slicf != "1" && slicf != "2"){
											continue
										}
										var currentScore = getScore(data.procs[cpu][ramchannel][ramspeed], data.gpus[gpu][slicf].score)
										var currentPrice = data.procs[cpu].price + data.gpus[gpu][slicf].price
										if(currentScore < score || currentPrice > (budget-resbudget)){
											continue
										}else if(currentScore > (score+offset)){
											continue
										}
										var pickedmobo,pickedram
										
										if(incmobo == true && incram == false){
											for(mobo in data.motherboards){
												if(data.motherboards[mobo].level > level){
													continue
												}else if((slicf == "2") && (data.motherboards[mobo].multigpu == null || (data.motherboards[mobo].multigpu.includes(data.gpus[gpu].multigpu) == false))){
													continue
												}else if(data.motherboards[mobo].socket != data.procs[cpu].socket){
													continue
												}else if(needoc == true && data.motherboards[mobo].oc != "Yes") {
													continue
												}else if(data.motherboards[mobo].speeds.includes(ramspeed.toString()) == false){
													continue
												}
												var tempCurrentPrice = currentPrice + data.motherboards[mobo].price
												if (tempCurrentPrice <= (budget - resbudget)) {
													currentPrice += data.motherboards[mobo].price
													pickedmobo = data.motherboards[mobo].fullName
													builds.push(parts(cpu, ramspeed, ramchannel, gpu, slicf, (pickedmobo || "-"), (pickedram || "-"), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][slicf].wattage), currentPrice, (budget - currentPrice)))
												}
											}
										}else if(incmobo == false && incram == true){
											for(rams in data.ram){
												if(data.ram[rams].level > level){
													continue
												}else if(data.ram[rams].baseFreq < Number(ramspeed)){
													continue
												}
												var tempCurrentPrice = currentPrice + (data.ram[rams].price * ramchannel)
												if (tempCurrentPrice <= (budget - resbudget)) {
													currentPrice += (data.ram[rams].price * ramchannel)
													pickedram = data.ram[rams].fullName
													builds.push(parts(cpu, ramspeed, ramchannel, gpu, slicf, (pickedmobo || "-"), (pickedram || "-"), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][slicf].wattage), currentPrice, (budget - currentPrice)))
												}
											}
										}else if(incmobo == true && incram == true){
											for(mobo in data.motherboards){
												if(data.motherboards[mobo].level > level){
													continue
												}else if((slicf == "2") && (data.motherboards[mobo].multigpu == null || (data.motherboards[mobo].multigpu.includes(data.gpus[gpu].multigpu) == false))){
													continue
												}else if(data.motherboards[mobo].socket != data.procs[cpu].socket){
													continue
												}else if(needoc == true && data.motherboards[mobo].oc != "Yes") {
													continue
												}else if(data.motherboards[mobo].speeds.includes(ramspeed.toString()) == false){
													continue
												}
												var tempCurrentPrice = currentPrice + data.motherboards[mobo].price
												if (tempCurrentPrice <= (budget - resbudget)) {
													currentPrice += data.motherboards[mobo].price
													pickedmobo = data.motherboards[mobo].fullName
													for(rams in data.ram){
														if(data.ram[rams].level > level){
															continue
														}else if(data.ram[rams].baseFreq < Number(ramspeed)){
															continue
														}
														var tempCurrentPrice = currentPrice + (data.ram[rams].price * ramchannel)
														if (tempCurrentPrice <= (budget - resbudget)) {
															currentPrice += (data.ram[rams].price * ramchannel)
															pickedram = data.ram[rams].fullName
															builds.push(parts(cpu, ramspeed, ramchannel, gpu, slicf, (pickedmobo || "-"), (pickedram || "-"), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][slicf].wattage), currentPrice, (budget - currentPrice)))
														}
													}
												}
											}
										}else{
											builds.push(parts(cpu, ramspeed, ramchannel, gpu, slicf, (pickedmobo || "-"), (pickedram || "-"), currentScore, (data.procs[cpu].wattage + data.gpus[gpu][slicf].wattage), currentPrice, (budget - currentPrice)))
										}
									}
								}
							}
						}
					}
				}
				builds.sort(sortByCost)
				var tempBuilds = []
				if (builds.length <= results) {
					tempBuilds = builds
					results = builds.length
				} else {
					tempBuilds.push(builds[0])
					tempBuilds.push(builds[builds.length - 1])
					for (i = 0; i < results - 2; i++) {
						tempBuilds.push(builds[getRandomInt(1, builds.length - 2)])
					}
				}
				tempBuilds.sort(sortByCost)
				var table = document.getElementById('buildMakerTable')
				for (i = table.rows.length - 1; i >= 1; i--) {
					table.deleteRow(i)
				}
				for (i = 1; i < results + 1; i++) {
					table.insertRow(i)
					for (a = 0; a < 12; a++) {
						table.rows[i].insertCell(a)
					}
				}
				for (i = 1; i < results + 1; i++) {
					table.rows[i].cells[0].innerHTML = tempBuilds[i - 1].processor
					table.rows[i].cells[1].innerHTML = tempBuilds[i - 1].channel
					table.rows[i].cells[2].innerHTML = tempBuilds[i - 1].ramspeed
					table.rows[i].cells[3].innerHTML = tempBuilds[i - 1].gpu
					table.rows[i].cells[4].innerHTML = tempBuilds[i - 1].slicf
					table.rows[i].cells[5].innerHTML = tempBuilds[i - 1].mobo
					table.rows[i].cells[6].innerHTML = tempBuilds[i - 1].ram
					table.rows[i].cells[7].innerHTML = tempBuilds[i - 1].cost
					table.rows[i].cells[8].innerHTML = tempBuilds[i - 1].budgetleft
					table.rows[i].cells[9].innerHTML = tempBuilds[i - 1].wattage
					table.rows[i].cells[10].innerHTML = tempBuilds[i - 1].score
					table.rows[i].cells[11] = addSaveButton(table.rows[i].cells[11],i)
				}
			}

			function sortByCost(a, b) {
				if (a.cost < b.cost) {
					return -1;
				}
				if (a.cost > b.cost) {
					return 1;
				}
				return 0;
			}

			function getRandomInt(min, max) {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min)) + min;
			}

			function upgradeBuild() {
				var currentProc = document.getElementById('upgradeForm').currentProc1.value
				var currentRamChannel = document.getElementById('upgradeForm').currentRamC1.value
				var currentRamSpeed = document.getElementById('upgradeForm').currentRamS1.value
				var currentGpu = document.getElementById('upgradeForm').currentGpu1.value
				var currentSlicf = document.getElementById('upgradeForm').currentSlicf1.value
				var currentMobo = document.getElementById('upgradeForm').currentMobo1.value
				var budget = Number(document.getElementById('upgradeForm').budget2.value)
				var resbudget = Number(document.getElementById('upgradeForm').resbudget2.value) || 0
				var score = Number(document.getElementById('upgradeForm').score2.value)
				var offset = Number(document.getElementById('upgradeForm').offset2.value)
				var level = Number(document.getElementById('upgradeForm').level2.value)
				var results = Number(document.getElementById('upgradeForm').results2.value) || 10
				var upgrades = []
				if (offset == "") {
					offset = 200
				} else {
					offset = Number(offset)
				}
				var currentScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[currentGpu][currentSlicf].score)
				if (currentScore > score) {
					alert("업그레이드가 필요 없어요!")
					return false
				}
				for (cpu in data.procs) {
					var cost = data.procs[cpu].price
					if (data.procs[cpu].socket != data.motherboards[currentMobo].socket) {
						continue
					} else if (data.procs[cpu].level > level) {
						continue
					} else if (cost > (budget - resbudget)) {
						continue
					}
					var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[currentGpu][currentSlicf].score)
					if ((newScore >= score) && (newScore < (score + offset))) {
						upgrades.push(parts(cpu, "-", "-", "-", "-", "-", "-", newScore, (data.procs[cpu].wattage + data.gpus[currentGpu][currentSlicf].wattage), cost, budget - cost))
					}
				}
				for (gpu in data.gpus) {
					if (data.gpus[gpu].level > level) {
						continue
					}
					for (sf in data.gpus[gpu]) {
						if (sf != "1" && sf != "2") {
							continue
						}
						var cost = data.gpus[gpu][sf].price
						if (sf == "2" && ((data.motherboards[currentMobo].multigpu == null) || (data.motherboards[currentMobo].multigpu.includes(data.gpus[gpu].multigpu) == false))) {
							continue
						}
						if (cost > (budget - resbudget)) {
							continue
						}
						var newScore = getScore(data.procs[currentProc][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].score)
						if ((newScore >= score) && (newScore < (score + offset))) {
							upgrades.push(parts("-", "-", "-", gpu, sf, "-", "-", newScore, (data.procs[currentProc].wattage + data.gpus[gpu][sf].wattage), cost, budget - cost))
						}
					}
				}
				if ((data.motherboards[currentMobo].multigpu != null) && (data.motherboards[currentMobo].multigpu).includes(data.gpus[currentGpu].multigpu)) {
					var cost = data.gpus[currentGpu]["1"].price
					var newScore = getScore(data.procs[currentProc][currentRamChannel][currentRamChannel], data.gpus[currentGpu]["2"])
					if (cost > (budget - resbudget)) {
						if ((newScore >= score) && (newScore < (score + offset))) {
							upgrades.push(parts("-", "-", "-", currentGpu, 2, "-", "-", newScore, (data.procs[currentProc].wattage + data.gpus[currentGpu]["2"].wattage), cost, budget - cost))
						}
					}
				}
				var proclist = Object.keys(data.procs)
				var indexOfProc = proclist.indexOf(currentProc)
				for (cpu in data.procs) {
					if (data.motherboards[currentMobo].socket != data.procs[cpu].socket) {
						continue
					} else if (data.procs[cpu].level > level) {
						continue
					} else if (indexOfProc >= proclist.indexOf(cpu)) {
						continue
					}
					for (gpu in data.gpus) {
						if (data.gpus[gpu].level > level) {
							continue
						}
						for (sf in data.gpus[gpu]) {
							if (sf != "1" && sf != "2") {
								continue
							} else if (sf == "2" && (data.motherboards[currentMobo].multigpu == null || (data.motherboards[currentMobo].multigpu.includes(data.gpus[gpu].multigpu) == false))) {
								continue
							}
							var newScore = getScore(data.procs[cpu][currentRamChannel][currentRamSpeed], data.gpus[gpu][sf].score)
							var cost = data.procs[cpu].price + data.gpus[gpu][sf].price
							if (cost < (budget - resbudget)) {
								if ((newScore >= score) && (newScore < (score + offset))) {
									upgrades.push(parts(cpu, "-", "-", gpu, sf, "-", "-", newScore, (data.procs[cpu].wattage + data.gpus[gpu][sf].wattage), cost, budget - cost))
								}
							}
						}
					}
				}
				upgrades.sort(sortByCost)
				var tempUpgrades = []
				if (upgrades.length <= results) {
					tempUpgrades = upgrades
					results = upgrades.length
				} else {
					tempUpgrades.push(upgrades[0])
					tempUpgrades.push(upgrades[upgrades.length - 1])
					for (i = 0; i < results - 2; i++) {
						tempUpgrades.push(upgrades[getRandomInt(1, upgrades.length - 2)])
					}
				}
				tempUpgrades.sort(sortByCost)
				var table = document.getElementById('buildUpgraderTable')
				for (i = table.rows.length - 1; i >= 1; i--) {
					table.deleteRow(i)
				}
				for (i = 1; i < results + 1; i++) {
					table.insertRow(i)
					for (a = 0; a < 11; a++) {
						table.rows[i].insertCell(a)
					}
				}
				for (i = 1; i < results + 1; i++) {
					table.rows[i].cells[0].innerHTML = tempUpgrades[i - 1].processor
					table.rows[i].cells[1].innerHTML = tempUpgrades[i - 1].channel
					table.rows[i].cells[2].innerHTML = tempUpgrades[i - 1].ramspeed
					table.rows[i].cells[3].innerHTML = tempUpgrades[i - 1].gpu
					table.rows[i].cells[4].innerHTML = tempUpgrades[i - 1].slicf
					table.rows[i].cells[5].innerHTML = tempUpgrades[i - 1].mobo
					table.rows[i].cells[6].innerHTML = tempUpgrades[i - 1].ram
					table.rows[i].cells[7].innerHTML = tempUpgrades[i - 1].cost
					table.rows[i].cells[8].innerHTML = tempUpgrades[i - 1].budgetleft
					table.rows[i].cells[9].innerHTML = tempUpgrades[i - 1].wattage
					table.rows[i].cells[10].innerHTML = tempUpgrades[i - 1].score
				}
			}

			function saveBuild(cpu, ramc, rams, gpu, slicf, mobo, ram, cost, budgetleft, wattage, score, type, remarks) {
				sessionStorage.setItem(new Date().getTime(), JSON.stringify({
					"cpu": cpu,
					"ramc": ramc,
					"rams": rams,
					"gpu": gpu,
					"slicf": slicf,
					"mobo": mobo,
					"ram": ram,
					"cost": cost,
					"budgetleft": budgetleft,
					"wattage": wattage,
					"score": score,
					"type": type,
					"remarks": remarks
				}))
			}
			
			var currSaves = 0
			
			setInterval(function(){
				if(currSaves < sessionStorage.length){
					currSaves = sessionStorage.length
					updateHistory()
				}
			},100)
			
			function updateHistory(){
				var x = document.getElementById('scoreCalculatorHistoryTable')
				var y = document.getElementById('buildMakerHistoryTable')
				for (i = x.rows.length - 1; i >= 1; i--) {
					x.deleteRow(i)
				}
				for (i = y.rows.length - 1; i >= 1; i--) {
					y.deleteRow(i)
				}
				
				var list = Object.keys(sessionStorage)
				list.forEach(function(item){
					var a = JSON.parse(sessionStorage[item])
					if(a.type == "scorecalculator"){
						var r = document.getElementById('scoreCalculatorHistoryTable')
						r.insertRow(1)
						for(i=0;i<12;i++){
							r.rows[1].insertCell(i)
						}
						r.rows[1].cells[0].innerHTML = a.cpu
						r.rows[1].cells[1].innerHTML = a.ramc
						r.rows[1].cells[2].innerHTML = a.rams
						r.rows[1].cells[3].innerHTML = a.gpu
						r.rows[1].cells[4].innerHTML = a.slicf
						r.rows[1].cells[5].innerHTML = a.mobo
						r.rows[1].cells[6].innerHTML = a.ram
						r.rows[1].cells[7].innerHTML = a.cost
						r.rows[1].cells[8].innerHTML = a.budgetleft
						r.rows[1].cells[9].innerHTML = a.wattage
						r.rows[1].cells[10].innerHTML = a.score
						r.rows[1].cells[11].innerHTML = a.remarks
					}else if(a.type == "build"){
						var r = document.getElementById('buildMakerHistoryTable')
						r.insertRow(1)
						for(i=0;i<12;i++){
							r.rows[1].insertCell(i)
						}
						r.rows[1].cells[0].innerHTML = a.cpu
						r.rows[1].cells[1].innerHTML = a.ramc
						r.rows[1].cells[2].innerHTML = a.rams
						r.rows[1].cells[3].innerHTML = a.gpu
						r.rows[1].cells[4].innerHTML = a.slicf
						r.rows[1].cells[5].innerHTML = a.mobo
						r.rows[1].cells[6].innerHTML = a.ram
						r.rows[1].cells[7].innerHTML = a.cost
						r.rows[1].cells[8].innerHTML = a.budgetleft
						r.rows[1].cells[9].innerHTML = a.wattage
						r.rows[1].cells[10].innerHTML = a.score
						r.rows[1].cells[11].innerHTML = a.remarks
					}
				})
			}