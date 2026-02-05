import { Router } from "express"

const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
    res.render("index", {title:"WebSockets"})
})

export default viewsRouter