window.render = () => {
	try {
		// ctx.globalAlpha = 1;
		ctx.fillStyle = '#b3b3b3'
		ctx.fillRect(0, 0, canvas.width, canvas.height);


		ctx.fillStyle = '#d6d6d6';
		const a = offset(0, 0);

		if (!arena) return;
		ctx.fillRect(a.x, a.y, arena.width, arena.height);

		const tileSize = 100;
		const maxDistToCamera = 1000;

		ctx.globalAlpha = 0.8;
		ctx.strokeStyle = 'gray';
		ctx.lineWidth = 0.5;
		for (let y = 0; y < arena.height; y += tileSize) {
			for (let x = 0; x < arena.width; x += tileSize) {
				if (Math.abs(x - camera.x) > maxDistToCamera ||
					Math.abs(y - camera.y) > maxDistToCamera) {
					continue;
				}
				ctx.strokeRect(a.x + x, a.y + y, tileSize, tileSize)
			}
		}
		ctx.globalAlpha = 1;

		if (window.showSnapshots) {
			ctx.globalAlpha = 0.5;
			for (const playerId of Object.keys(shotPlayers)) {
				const player = shotPlayers[playerId];
				ctx.fillStyle = 'orange'
				ctx.beginPath();
				const pos = offset(player.pos.x, player.pos.y)
				ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'black';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
                let d = {playerid: playerId, str: player.name}
                call_callbacks("render_player_name",d)
                ctx.fillText(d.str, pos.x, pos.y - player.radius * 1.5)
                
            }
			ctx.globalAlpha = 1
		}

		for (const { x, y, width, height, type } of obstacles) {
			const pos = offset(x, y);
			if (type == "obstacle") {
				ctx.fillStyle = '#b3b3b3';
			}
			else if (type == "bounce") {
				ctx.fillStyle = '#32a852';
			}
			if (type === 'point') {
				ctx.fillStyle = '#fcb000'
				// ctx.strokeStyle = '#fcb000';
				// ctx.lineWidth = 10;
				// ctx.strokeRect(pos.x, pos.y, width, height)
				ctx.globalAlpha = 0.5;
			}
			ctx.fillRect(pos.x, pos.y, width, height)
			ctx.globalAlpha = 1;
		}

		ctx.drawImage(blockCanvas, a.x, a.y, arena.width, arena.height)

		for (const arrowId of Object.keys(arrows)) {
			// console.log(arrows[arrowId])
			const { lerpAngle, radius, life, alpha, parent, fake } = arrows[arrowId]
			const { x, y } = arrows[arrowId].pos;
			ctx.globalAlpha = fake &&( parent === selfId || hax.antiscry)? alpha * 0.2 : alpha; // life 
			// ctx.fillStyle = '#d93311';
			// ctx.strokeStyle = '#a30800';
			// ctx.beginPath();
			const pos = offset(x, y);

			ctx.translate(pos.x, pos.y);
			ctx.rotate(lerpAngle + Math.PI / 2);
			ctx.fillStyle = '#ff0000';
			// if (players[parent] ?.dev) {
			// 	ctx.fillStyle = `hsl(${ghue}, 70%, 30%)`;
			// }
			if (arrows[arrowId].freezed) {
				ctx.fillStyle = '#0055ff'
			}
			if (arrows[arrowId].gravity) {
				ctx.fillStyle = '#761dad'
			}
			if (arrows[arrowId].redirected) {
				ctx.fillStyle = '#780000'
			}
			ctx.beginPath();
			ctx.rect(-6.25, -18.75, 12.5, 37.5);
			ctx.fill()
			ctx.globalAlpha = 1;
			ctx.rotate(-(lerpAngle + Math.PI / 2));
			ctx.translate(-pos.x, -pos.y);
		}
		ctx.globalAlpha = 1;


		for (const playerId of Object.keys(players)) {
			const player = players[playerId];

			if (Math.abs(player.pos.x - camera.x) > maxDistToCamera ||
				Math.abs(player.pos.y - camera.y) > maxDistToCamera) {
				continue;
			}

			const pos = offset(player.pos.x, player.pos.y)



			// ctx.fillStyle = "#a37958";
			ctx.fillStyle = Character[player.characterName].Color;
			// if (leader != null && playerId === leader.id) {
			// 	ctx.fillStyle = ' #deae12'
			// }
			if (player.timer > 0 || (player.characterName === 'Scry' && !player.showAim)) {
				ctx.fillStyle = Character[player.characterName].ArrowCdColor;
				// if (leader != null && playerId === leader.id) {
				// 	ctx.fillStyle = '#c2ac65'
				// }
			}
			if (player.dev) {
				// ctx.fillStyle = `hsl(${ghue}, 100%, 50%)`;
			}
			if (player.passive) {
				ctx.globalAlpha = 0.3;
			}
			// ctx.strokeStyle = '#363636';
			ctx.lineWidth = 2.5;
			ctx.beginPath();
			// const pos = offset(player.pos.x, player.pos.y)

			ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
			ctx.fill();

			if (player.characterName === 'Stac') {
				if (player.point_x != null && player.point_y != null) {
					ctx.fillStyle = '#004f4f';
					const pointPos = offset(player.point_x, player.point_y);
					ctx.beginPath();
					ctx.arc(pointPos.x, pointPos.y, 10, 0, Math.PI * 2);
					// if (playerId === selfId) {
					// 	ctx.strokeStyle = '#00ebc7';
					// 	ctx.lineWidth = 10;
					// 	ctx.stroke()
					// }
					ctx.fill()
				}
				if (playerId === selfId && player.arrowing > 0 && player.canCreatePoint) {
					ctx.fillStyle = '#004f4f';
					ctx.globalAlpha = 0.5;
					const preview = offset(
						player.pos.x + Math.cos(player.interpAngle) * (player.radius + 250),
						player.pos.y + Math.sin(player.interpAngle) * (player.radius + 250),
					);
					ctx.beginPath()
					ctx.arc(preview.x, preview.y, 10, 0, Math.PI * 2);
					ctx.fill();
					ctx.globalAlpha = 1;
				}
			}
			// if (player.characterName === 'Crescent') {
			// 	ctx.globalAlpha = 0.2;
			// 	ctx.fillStyle = '#8225cf';
			// 	ctx.beginPath();
			// 	ctx.arc(pos.x, pos.y, 600, 0, Math.PI * 2);
			// 	ctx.fill()
			// 	ctx.globalAlpha = 1;
			// }
			if (player.characterName === 'Flank' && !intermission && player.abilityCd <= 0 && player.arrowing > 0 && !player.passive && playerId === selfId) {
				ctx.globalAlpha = 0.15;
				ctx.fillStyle = '#059905';
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, 450, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = '#024d02';
				let shortestDistance = null;
				let otherId = null;
				for (const pi of Object.keys(players)) {
					if (pi === selfId) continue;
					const other = players[pi];
					if (other.timer > 0 || (other.characterName === 'Scry' && !other.showAim)) {
						continue;
					}
					const distX = player.pos.x - other.pos.x;
					const distY = player.pos.y - other.pos.y;
					const dist = Math.sqrt(distX * distX + distY * distY);
					if (dist < 450 + other.radius) {
						if (shortestDistance == null) {
							shortestDistance = dist;
							otherId = pi;
						} else if (shortestDistance != null && dist < shortestDistance) {
							shortestDistance = dist;
							otherId = pi;
						}
					}
				}
				if (otherId != null) {
					const other = players[otherId];
					const dest = {
						x: other.pos.x + Math.cos(player.interpAngle) * ((player.arrowing / 3) * 200),
						y: other.pos.y + Math.sin(player.interpAngle) * ((player.arrowing / 3) * 200),
					}
					ctx.globalAlpha = 0.5;
					const destPos = offset(dest.x, dest.y);
					ctx.beginPath();
					ctx.arc(destPos.x, destPos.y, player.radius, 0, Math.PI * 2);
					ctx.fill()
				}
				// c
				ctx.globalAlpha = 1;
			}

			if (player.characterName === 'Crescent' && player.gravX != null && player.gravY != null) {
				ctx.fillStyle = '#3d0254';
				ctx.globalAlpha = 0.5;
				ctx.beginPath();
				const pos = offset(player.gravX, player.gravY);
				ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
				ctx.fill()
				ctx.globalAlpha = 1;
			}
			if (player.canDash && player.characterName === 'Conquest') {
				const force = player.lastDashForce;
				let dashPos = offset(
					player.pos.x + Math.cos(player.iDashAngle) * 50 + Math.cos(player.iDashAngle) * (force) * 300,
					player.pos.y + Math.sin(player.iDashAngle) * 50 + Math.sin(player.iDashAngle) * (force) * 300,
				);

				ctx.globalAlpha = 0.7;
				ctx.fillStyle = '#330e00'
				if (player.arrowing > 0 && !player.changedLastTime) {
					ctx.fillStyle = '#cf3a02'
				}
				ctx.beginPath();
				ctx.arc(dashPos.x, dashPos.y, player.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1;
			}

			if (player.passive) {
				ctx.globalAlpha = 1;
			}

			if (player.dying) {
				ctx.fillStyle = '#d40000';
				ctx.globalAlpha = 0.5;
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1;
			}


			ctx.translate(pos.x, pos.y);
			ctx.rotate(player.interpAngle + Math.PI / 2);

			if (player.arrowing > 0 && (player.characterName !== 'Scry' || (player.characterName === 'Scry' && (playerId === selfId || player.showAim)))) {
				const ga = (player.characterName === 'Scry' && playerId === selfId && !player.showAim)
					? 0.5 : 1;
				ctx.beginPath();
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 1;
				ctx.lineTo(Math.cos(1.25 * Math.PI) * (60), Math.sin(1.25 * Math.PI) * (60));
				ctx.lineTo(-5, -30 + player.arrowing * 25);
				ctx.lineTo(5, -30 + player.arrowing * 25);
				ctx.lineTo(Math.cos(1.75 * Math.PI) * (60), Math.sin(1.75 * Math.PI) * (60));
				ctx.stroke();

				ctx.globalAlpha = 0.5 * ga;
				ctx.beginPath();
				ctx.strokeStyle = '#ff0000'
				ctx.lineTo(0, -60 + player.arrowing * 25);
				ctx.lineTo(0, -150);
				ctx.stroke();
				ctx.globalAlpha = 1 * ga;

				ctx.beginPath();
				ctx.arc(0, 0, 60, 1.25 * Math.PI, 1.75 * Math.PI, false);
				ctx.lineWidth = 5;
				ctx.strokeStyle = '#ff2626';
				if (player.characterName === 'Scry' && playerId === selfId && player.canFakeArrow) {
					ctx.strokeStyle = '#f700ff'
				}
				ctx.stroke();

				ctx.fillStyle = '#ff0000';
				if (player.characterName === 'Scry' && playerId === selfId && player.canFakeArrow) {
					ctx.fillStyle = '#ff0062'
				}
				// if (player.dev) {
				// 	ctx.fillStyle = `hsl(${ghue}, 70%, 30%)`;
				// }

				ctx.fillRect(-5, -60 + player.arrowing * 25, 10, 30);
				ctx.globalAlpha = 1;


			}

			// ctx.restore();
			ctx.rotate(-(player.interpAngle + Math.PI / 2));
			ctx.translate(-pos.x, -pos.y);

			if (window.showSnapshots) {
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = "green";
				ctx.beginPath();
				const pos = offset(player.server.x, player.server.y)
				ctx.arc(pos.x, pos.y, player.radius, 0, Math.PI * 2);
				ctx.fill();
				ctx.globalAlpha = 1;
			}
			ctx.fillStyle = 'black';
			if (leader != null && leader.id === playerId) {
				ctx.fillStyle = '#c20000'
			}
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle'
			ctx.font = `22px ${window.font}`
			if (!player.dying) {
                let d = {playerid: playerId, str: player.name}
                call_callbacks("render_player_name",d)
                ctx.fillText(d.str, pos.x, pos.y + player.radius * 1.5)
            }

			if (player.chatMessageTimer > 0) {
				ctx.globalAlpha = player.chatMessageTimer > 0.5 ? 1 : (player.chatMessageTimer * 2) / 1;
				ctx.fillText(player.chatMessage, pos.x, pos.y - player.radius * 1.5)
				ctx.globalAlpha = 1;
			}
		}


		ctx.globalAlpha = 1;


		ctx.font = `25px ${window.font}`
		ctx.fillStyle = '#000000'
		for (const { x, y, score, timer } of hits) {
			const pos = offset(x, y);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			if (timer <= 0.5) {
				ctx.globalAlpha = (timer * 2)
			}
			ctx.fillText(`+${score}`, pos.x, pos.y);
			ctx.globalAlpha = 1;
		}



		// ctx.fillStyle = "green";
		// ctx.beginPath();
		// const pos = offset(rotator.x, rotator.y)
		// ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
		// ctx.fill();

		ctx.fillStyle = 'black';
		ctx.globalAlpha = !intermission ? overlayAlpha : 0.5;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;
		if (intermission) {
			ctx.fillStyle = 'white';
			ctx.fillText(`- ${interMissionMessage} - `, canvas.width / 2, canvas.height / 2 + 300);
		}

		ctx.globalAlpha = window.redness;
		ctx.fillStyle = '#eb0000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;

		ctx.globalAlpha = killedNotifTime;
		ctx.fillStyle = '#0d0d0d';
		// ctx.fillRect(600, 700, 400, 50);
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = 'rgb(255, 0, 0)';
		ctx.font = `22px ${window.font}`
		ctx.fillText(`Eliminated`, 700, 725)
		const xOff = ctx.measureText('Eliminated').width;
		ctx.fillStyle = 'black'
		ctx.fillText(` ${killedPlayerName}`, 700 + xOff, 725);
		ctx.globalAlpha = 1;


		// minimap

		if ((players[selfId] != null && !players[selfId].dying) && !intermission) {

			const mwidth = 200;
			const mheight = 200;

			ctx.globalAlpha = 0.75;
			ctx.fillStyle = '#707070';
			ctx.fillRect(0, canvas.height - mheight, mwidth, mheight);

			ctx.fillStyle = '#595959'
			for (const { x, y, width, height, type } of obstacles) {
				if (type == "obstacle") {
					ctx.fillStyle = '#595959';
				}
				else if (type == "bounce") {
					ctx.fillStyle = '#00fc08';
				} else if (type === 'point') {
					ctx.fillStyle = '#fcb000';
					ctx.globalAlpha = 0.4;
				}
				ctx.fillRect((x / arena.width) * mwidth, (canvas.height - mheight) + (y / arena.height) * mheight, (width / arena.width) * mwidth, (height / arena.height) * mheight)
				ctx.globalAlpha = 1;
			}


			for (const playerId of Object.keys(players)) {
				const player = players[playerId];
				if (player.dying) {
					ctx.fillStyle = '#ff0000';
					ctx.font = `25px ${window.font}`;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText('X', (player.pos.x / arena.width) * mwidth, (canvas.height - mheight) + (player.pos.y / arena.height) * mheight)
				} else {
					if (playerId === selfId && player.characterName === 'Stac' && player.point_x != null && player.point_y != null) {
						ctx.fillStyle = '#13d1bb';
						ctx.beginPath();
						ctx.arc((player.point_x / arena.width) * mwidth, (canvas.height - mheight) + (player.point_y / arena.height) * mheight, (60 / arena.width) * mwidth, 0, Math.PI * 2);
						ctx.fill()
						// ctx.strokeStyle = '#00ebc7';
						// ctx.lineWidth = (15 / arena.width) * mwidth;
						// ctx.stroke()
					}
					ctx.fillStyle = '#000000';
					if (leader != null && playerId === leader.id) {
						ctx.fillStyle = '#d90000'
					}
					ctx.beginPath();
					ctx.arc((player.pos.x / arena.width) * mwidth, (canvas.height - mheight) + (player.pos.y / arena.height) * mheight, (player.radius / arena.width) * mwidth, 0, Math.PI * 2)
					ctx.fill()
				}
			}
		}

		ctx.globalAlpha = 1;



		ctx.font = `18px ${window.font}`

		ctx.fillStyle = 'rgb(100, 0, 0)';
		ctx.textAlign = 'left'
		if (window.debug) {
			ctx.fillText(`Players: ${Object.keys(players).length} | Download: ${stateMessageDisplay} msg/s (${(byteDisplay / 1000).toFixed(1)}kb/s | Upload: ${(uploadByteDisplay / 1000).toFixed(1)}kb/s | ${inputMessageDisplay} msg/s (inputs) | Ping: ${ping}ms | Spacing:[${lowest(spacings).toFixed(1)}, ${spacing.toFixed(1)}, ${highest(spacings).toFixed(1)}]ms | ServerSpacing: [${serverSpacing[0]}, ${serverSpacing[1]}, ${serverSpacing[2]}] | Angle: ${players[selfId] ?.angle.toFixed(1)}`
				, 200, 800);
			ctx.fillText(`Extralag: ${extraLag} | Interpolation: ${window.delta.toFixed(1)} / 1 | Interpolate: ${window._interpolate.toString().toUpperCase()} | Input Delay: ${Math.ceil((ping * 2) / (1000 / 60))} frames | Arrows: ${Object.keys(arrows).length} | ServerTickTime: ${serverTickMs}ms | ServerFrameTime: ${Math.round(serverTickMs / 60)}ms | ${window.fps}fps`
				, 200, 825)
		}

		ctx.fillStyle = '#0f0f0f';
		ctx.fillRect(canvas.width - 355, canvas.height - 30, 355, 30)

		ctx.beginPath();
		ctx.lineTo(canvas.width - 355, canvas.height - 30);
		ctx.lineTo(canvas.width - 380, canvas.height);
		ctx.lineTo(canvas.width - 355, canvas.height);
		ctx.fill()

		ctx.font = `15px ${window.font}`
		ctx.fillStyle = '#00ff59';



		if (window.autoRespawn) {
			ctx.fillText("[R] Auto Respawn: On", canvas.width - 160, canvas.height - 15)
		} else {
			ctx.fillText("[R] Auto Respawn: Off", canvas.width - 160, canvas.height - 15)
		}

		ctx.fillStyle = '#ddff00';

		if (window.movementMode === 'wasd') {
			ctx.fillText('[V] WASD', canvas.width - 355, canvas.height - 15);
		} else {
			ctx.fillText('[V] ULDR', canvas.width - 355, canvas.height - 15)
		}

		ctx.fillStyle = '#00c8ff';
		ctx.fillText(`[M] Music: ${window.music ? 'On' : 'Off'}`, canvas.width - 270, canvas.height - 15)



		if (tab || intermission) {
			const sortedPlayers = Object.keys(players).sort((a, b) => players[b].score - players[a].score);
			ctx.globalAlpha = 0.8;
			ctx.fillStyle = 'black'
			const top = 200 - (25 + sortedPlayers.length * 25) / 2;
			ctx.fillRect(600, top, 400, 25 + sortedPlayers.length * 25);
			ctx.globalAlpha = 1;
			let index = 0;
			for (const id of sortedPlayers) {
				const { score, name } = players[id];
				const strScore = score <= 999 ? `${Math.floor(score)}` : `${Math.floor((score / 1000) * 100) / 100}k`
				ctx.fillStyle = '#c4c4c4';
				ctx.font = `20px ${font}`
				ctx.fillText(`${index + 1}.`, 610, top + 25 + index * 25)
				ctx.fillText(`${strScore}`, 990 - ctx.measureText(`${strScore}`).width, top + 25 + index * 25)
				index++;
				ctx.fillStyle = '#ff0000'
				if (id === selfId) {
					ctx.fillStyle = 'white'
				}
				ctx.fillText(`${iExist && !dead && players[selfId].dev ? `[${id}] ` : ''}${name}`, 640, top + index * 25)
			}
			// ctx.strokeStyle = 'black';
			// ctx.lineWidth = 1;
			// ctx.beginPath();
			// ctx.lineTo(600, top + 12.5 + index * 25);
			// ctx.lineTo(1000, top + 12.5 + index * 25);
			// ctx.stroke()
		}
		if (iExist && !dead) {
			const score = Math.round(players[selfId].score);

			ctx.fillStyle = '#0f0f0f';
			ctx.font = `20px ${font}`;

			// ctx.globalAlpha = 0.8;
			ctx.fillRect(1500, 0, 100, 50);

			ctx.beginPath();
			ctx.lineTo(1500, 0);
			ctx.lineTo(1475, 0);
			ctx.lineTo(1500, 50);
			ctx.fill()

			// ctx.globalAlpha = 1;

			ctx.fillStyle = 'white';
			ctx.textAlign = 'center'
			ctx.fillText(`${score} `, (1535), 25);
			ctx.fillStyle = '#ffc800';
			ctx.fillText(`ap`, 1545 + ctx.measureText(`${score} `).width / 2, 25)


		}

		ctx.fillStyle = '#0f0f0f';
		ctx.fillRect(750, 0, 100, 40);

		ctx.beginPath();
		ctx.lineTo(750, 0);
		ctx.lineTo(725, 0);
		ctx.lineTo(750, 40);
		ctx.fill()

		ctx.beginPath();
		ctx.lineTo(850, 0);
		ctx.lineTo(875, 0);
		ctx.lineTo(850, 40);
		ctx.fill()

		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.font = `25px ${font}`
		ctx.fillText(`${convert(roundTime)}`, 800, 20);

		ctx.globalAlpha = 0.7;
		ctx.fillStyle = '#0f0f0f';
		ctx.fillRect(0, 0, 375, 250);
		if (chatOpen || ref.chat.value != '') {
			ctx.fillRect(0, 250, 350, 25);

			ctx.beginPath();
			ctx.lineTo(350, 250);
			ctx.lineTo(375, 250);
			ctx.lineTo(350, 250 + 25);
			ctx.fill()
		}
		ctx.globalAlpha = 1;



		if (players[selfId] && players[selfId].dev) {
			ctx.font = `25px ${font}`;
			ctx.fillStyle = `hsl(${ghue}, 70%, 30%)`;
			ctx.fillText('[DEV MODE]', 1400, 25);
		}

		actx.clearRect(0, 0, actx.canvas.width, actx.canvas.height);
		if (players[selfId] && !intermission) {
			actx.fillStyle = 'black';
			actx.globalAlpha = 0.7;
			actx.beginPath()
			actx.lineTo(30, 30)
			actx.arc(30, 30, 60, Math.PI * 2 * Math.max((players[selfId].abilityCooldown / players[selfId].maxCd), 0), 0);
			actx.fill()
			actx.globalAlpha = 1;
			if (players[selfId].abilityCd <= 0 && players[selfId].characterName === 'Klaydo') {
				actx.fillStyle = '#66000a';
				actx.globalAlpha = 0.7;
				actx.beginPath()
				actx.lineTo(30, 30)
				actx.arc(30, 30, 60, -Math.PI * 2 * Math.max((players[selfId].timeSpentFreezing / players[selfId].timeFreezeLimit), 0), 0);
				actx.fill()
			}
			ctx.drawImage(abilityCanvas, canvas.width / 2 - 30, canvas.height - 60, 60, 60)
		}
		// if (players[selfId] && players[selfId].characterName === 'Klaydo' && !intermission) {
		// 	// actx.drawImage(textures.Kronos, 0, 0, 60, 60);
		// 	actx.fillStyle = 'black';
		// 	actx.globalAlpha = 0.6;
		// 	actx.beginPath()
		// 	actx.lineTo(30, 30)
		// 	actx.arc(30, 30, 60, Math.PI * 2 * Math.max((players[selfId].abilityCd / players[selfId].maxCd), 0), 0);
		// 	actx.fill()
		// 	if (players[selfId].abilityCd <= 0) {
		// 		actx.fillStyle = '#66000a';
		// 		actx.globalAlpha = 0.7;
		// 		actx.beginPath()
		// 		actx.lineTo(30, 30)
		// 		actx.arc(30, 30, 60, -Math.PI * 2 * Math.max((players[selfId].timeSpentFreezing / players[selfId].timeFreezeLimit), 0), 0);
		// 		actx.fill()
		// 	}
		// 	actx.globalAlpha = 1;
		// 	ctx.drawImage(abilityCanvas, canvas.width / 2 - 30, canvas.height - 60, 60, 60)
		// }
		// if (leader != null) {
		// 	ctx.globalAlpha = 0.9;
		// 	// ctx.fillStyle = '#303030';
		// 	// ctx.fillRect(canvas.width - 350, 0, 350, 100)

		// 	ctx.fillStyle = 'black'

		// 	ctx.fillText('Current King', canvas.width - ctx.measureText('Current King').width * 1.75, 20);

		// 	ctx.strokeStyle = 'black';
		// 	ctx.lineWidth = 3;
		// 	ctx.beginPath();
		// 	ctx.lineTo(canvas.width - ctx.measureText('Current King').width * 2.3, 45);
		// 	ctx.lineTo(canvas.width - ctx.measureText('Current King').width / 5, 45);
		// 	ctx.stroke()
		// 	const width = ctx.measureText('Current King').width
		// 	ctx.textAlign = 'center'
		// 	ctx.fillStyle = 'black'
		// 	ctx.font = `22px ${window.font}`
		// 	ctx.fillText(`${leader.name} with ${leader.kills} eliminations`, canvas.width - width * 1.25, 70);
		// 	ctx.globalAlpha = 1;
		// }
		ctx.fillStyle = 'black';
		ctx.globalAlpha = overlayAlpha;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1;
	//} catch (err) {
	//	document.body.innerHTML = err + 'from render' + JSON.stringify(leader);
	//}
	} catch (err) {
		document.body.innerHTML = err + 'from render' + JSON.stringify(leader);
	}
}	
