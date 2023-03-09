export class Lost extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'new' });
    }

    preload ()
    {
        this.load.image('robota', 'assets/pics/robota-uxo-by-made-of-bomb.jpg');
        this.load.image('neuromancer', 'assets/pics/neuromancer.jpg');
    }

    create ()
    {
        this.add.image(400, 300, 'robota');

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {

            this.add.image(400, 300, 'neuromancer');

            camera.fadeIn(6000, 255);

        }, this);

        this.cameras.main.fadeOut(6000, 255);
    }
}
