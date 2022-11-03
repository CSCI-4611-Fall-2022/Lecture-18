/* Lecture 18
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'
import { Robot } from './Robot';
import { KeyframeAnimation } from './KeyframeAnimation';

export class RobotApp extends gfx.GfxApp
{
    private cameraControls: gfx.OrbitControls;
    private target: gfx.TransformWidget;
    private robot: Robot;
    private animation: KeyframeAnimation;

    constructor()
    {
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.target = new gfx.TransformWidget(0.2, 0.01, 0.025);
        this.robot = new Robot();
        this.animation = new KeyframeAnimation(this.target, 1);
    }

    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, .1, 20)
        this.cameraControls.setTargetPoint(new gfx.Vector3(0, 0.6, 0));
        this.cameraControls.setDistance(1.5);

        // Set a black background
        this.renderer.background.set(0, 0, 0);
        
        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Vector3(0.3, 0.3, 0.3));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Vector3(0.6, 0.6, 0.6));
        directionalLight.position.set(2, 1, 3)
        this.scene.add(directionalLight);

        // Create a grid for the ground plane
        const gridSize = 10;
        const gridVertices: number[] = [];
        for(let i=-gridSize/2; i <= gridSize/2; i++)
        {
            gridVertices.push(-gridSize/2, 0, i);
            gridVertices.push(gridSize/2, 0, i);
            gridVertices.push(i, 0, -gridSize/2);
            gridVertices.push(i, 0, gridSize/2);
        }

        const gridLines = new gfx.Line3(gfx.LineMode3.LINES);
        gridLines.setVertices(gridVertices);
        gridLines.createDefaultVertexColors();
        gridLines.material.color.set(0.5, 0.5, 0.5);
        this.scene.add(gridLines);

        // Add the robot to the scene
        this.robot.createMeshes();
        this.scene.add(this.robot);

        // Add the target widget to the scene
        this.target.position.set(0.5, 0.6, -0.5);
        this.scene.add(this.target);

        // Create the GUI
        const gui = new GUI();

        const animationControls = gui.addFolder('Animation');
        animationControls.open();

        const motionModeControl = animationControls.add(this.animation, 'motionMode', ["Linear", "Curve"]);
        motionModeControl.name('Motion');

        const animationSpeedControl = animationControls.add(this.animation, 'animationSpeed', .1, 5);
        animationSpeedControl.name('Speed');

        const keyframeButton = animationControls.add(this.animation, 'addKeyframe');
        keyframeButton.name('Add Keyframe');

        const playButton = animationControls.add(this.animation, 'play');
        playButton.name('Play Animation');

        const resetButton = animationControls.add(this.animation, 'reset');
        resetButton.name('Reset Animation');
    }

    update(deltaTime: number): void 
    {
        // Update the animation
        this.animation.update(deltaTime);

        // If the animation is currently playing, make the target invisible
        if(this.animation.isPlaying())
        {
            this.target.visible = false;
        }
        // If the animation has stopped, then we can interact with the target
        else
        {
            this.target.visible = true;
            
            // Update the transform widget
            this.target.update(deltaTime);
        }

        // Update the camera orbit controls only if the target is not being moved
        if(this.target.isSelected())
        {
            this.cameraControls.freeze();
        }
        else
        {
            this.cameraControls.update(deltaTime);
        }
        
        // Update the robot pose
        this.robot.update(this.target.position);
    }
}