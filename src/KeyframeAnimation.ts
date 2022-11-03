/* Lecture 18
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

// For more information on generating smooth curves using Catmull-Rom splines, see:
// https://qroph.github.io/2018/07/30/smooth-paths-using-catmull-rom-splines.html

import * as gfx from 'gophergfx'

export class KeyframeAnimation
{
    public targetObject: gfx.Transform3;
    public animationSpeed: number;
    public motionMode: string;
    
    constructor(targetObject: gfx.Transform3, animationSpeed: number)
    {
        this.targetObject = targetObject;
        this.animationSpeed = animationSpeed;
        this.motionMode = 'Linear';
    }

    isPlaying(): boolean
    {
        // TO BE ADDED
        return false;
    }

    addKeyframe(): void
    {
        // TO BE ADDED
    }

    play(): void
    {
       // TO BE ADDED
    }

    stop(): void
    {
        // TO BE ADDED
    }

    reset(): void
    {
        // TO BE ADDED
    }

    update(deltaTime: number)
    {
        // TO BE ADDED
    }
}