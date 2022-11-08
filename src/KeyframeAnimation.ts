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
    public curvePath: gfx.CurvePath3;

    public currentTime: number;
    public currentFrame: number;
    
    constructor(targetObject: gfx.Transform3, animationSpeed: number)
    {
        this.targetObject = targetObject;
        this.animationSpeed = animationSpeed;
        this.motionMode = 'Linear';

        this.keyframeTimes = [];
        this.linearPath = new gfx.LinearPath3();
        this.curvePath = new gfx.CurvePath3();

        this.currentTime = -1;
        this.currentFrame = 0;
    }

    isPlaying(): boolean
    {
        return this.currentTime >= 0;
    }

    addKeyframe(): void
    {
        const index = this.keyframeTimes.length;

        if(index == 0)
        {
            this.keyframeTimes.push(0);
            this.linearPath.controlPoints.push(this.targetObject.position.clone());
            this.curvePath.controlPoints.push(this.targetObject.position.clone());

            console.log('Added keyframe ' + (index + 1) + '.');
        }
        else if(this.linearPath.controlPoints[index - 1].equals(this.targetObject.position))
        {
            console.log('Duplicate keyframe not added.');
        }
        else
        {
            const distance = this.targetObject.position.distanceTo(
                this.linearPath.controlPoints[index - 1] 
            );

            const frameTime = this.keyframeTimes[index - 1] + distance / this.animationSpeed;
            this.keyframeTimes.push(frameTime);
            this.linearPath.controlPoints.push(this.targetObject.position.clone());
            this.curvePath.controlPoints.push(this.targetObject.position.clone());

            console.log('Added keyframe ' + (index + 1) + '.');
        }
    }

    play(): void
    {
        if(this.motionMode == 'Linear')
        {
            if(this.keyframeTimes.length >= 2)
            {
                this.currentTime = 0;
                this.currentFrame = 0;
            }
            else
            {
                this.stop();
                console.log('Sorry, I can\'t generate a linear path until you add two keyframes.');
            }
        }
        else
        {
            if(this.keyframeTimes.length >= 4)
            {
                this.currentTime = 0;
                this.currentFrame = 0;
            }
            else
            {
                this.stop();
                console.log('Sorry, I can\'t generate a smooth curve until you add four keyframes.');
                console.log('Why, you ask? Ask Catmull. Or Rom.');
            }
        }
    }

    stop(): void
    {
        this.currentTime = -1;
        this.currentFrame = 0;
    }

    reset(): void
    {
        this.stop();
        this.keyframeTimes = [];
        this.linearPath.controlPoints = [];
        console.log('Keyframes reset.');
    }

    update(deltaTime: number)
    {
        if(this.isPlaying())
        {
            // Advance the time
            this.currentTime += deltaTime;

            // Check to see if we should advance the current frame
            if(this.currentTime >= this.keyframeTimes[this.currentFrame+1])
            {
                this.currentFrame++;
            }

            // If we have reached the final frame, then stop the animation
            if(this.currentFrame >= this.keyframeTimes.length - 1)
            {
                this.stop();
            }
            // Otherwise, compute the next point along the path
            else 
            {
                const totalFrameTime = this.keyframeTimes[this.currentFrame+1] - this.keyframeTimes[this.currentFrame];
                const currentFrameTime = this.currentTime - this.keyframeTimes[this.currentFrame];

                let point: gfx.Vector3 | null;

                if(this.motionMode == 'Linear')
                    point = this.linearPath.getPoint(this.currentFrame, currentFrameTime / totalFrameTime);
                else
                    point = this.curvePath.getPoint(this.currentFrame, currentFrameTime / totalFrameTime);

                // If the path generated a valid point, then update the target object
                if(point)
                {
                    this.targetObject.position = point;
                }
                // The path did not generate a valid point, so stop the animation
                else
                {
                    this.stop();
                }
            }
        }
    }
}