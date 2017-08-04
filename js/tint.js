/*
if (this.tint)
{
    fu = document.createElement('canvas')
    fu.width = this.w;
    fu.height = this.h;
    fuc = fu.getContext('2d');

    fuc.drawImage(tex.image,
        0,
        0,
        this.w,
        this.h);

    fuc.globalCompositeOperation = "source-in";
    fuc.fillStyle = this.tint;
    fuc.fillRect(0, 0, this.w, this.h);

    glip = new Image()
    glip.src = fu.toDataURL();

    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(glip, 0,0, this.w, this.h);
    ctx.globalCompositeOperation = "source-over";
}
*/