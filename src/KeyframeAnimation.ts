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

    public keyframeTimes: number[];
    public linearPath: gfx.LinearPath3;
    
    constructor(targetObject: gfx.Transform3, animationSpeed: number)
    {
        this.targetObject = targetObject;
        this.animationSpeed = animationSpeed;
        this.motionMode = 'Linear';

        this.keyframeTimes = [];
        this.linearPath = new gfx.LinearPath3();
    }

    isPlaying(): boolean
    {
        // TO BE ADDED
        return false;
    }

    addKeyframe(): void
    {
        const index = this.keyframeTimes.length;

        if(index == 0)
        {
            this.keyframeTimes.push(0);
            this.linearPath.controlPoints.push(this.targetObject.position.clone());

            console.log('Added keyframe ' + (index + 1) + '.');
        }
        else if(this.linearPath.controlPoints[index - 1].equals(this.targetObject.position))
        {
            console.log('Duplicate keyframe not added.');
        }
        else
        {
            const frameTime = this.keyframeTimes[index - 1] + this.animationSpeed;
            this.keyframeTimes.push(frameTime);
            this.linearPath.controlPoints.push(this.targetObject.position.clone());

            console.log('Added keyframe ' + (index + 1) + '.');
        }
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