"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = exports.UpdateUser = exports.CreateUser = exports.GetUser = exports.GetUsers = exports.Auth = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const prismaclient_1 = __importDefault(require("../client/prismaclient"));
const Auth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Credenciales incompletas" });
        const user = yield prismaclient_1.default.user.findUnique({
            where: { email },
        });
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });
        const isMatch = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Contraseña incorrecta" });
        const token = (0, jsonwebtoken_1.sign)({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.Auth = Auth;
const GetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prismaclient_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                rut: true,
                email: true,
                branch: true,
            },
        });
        return res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.GetUsers = GetUsers;
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prismaclient_1.default.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                rut: true,
                email: true,
                branch: true,
            },
        });
        return res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.GetUser = GetUser;
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, rut, email, password, branch_id } = req.body;
        if (!name || !rut || !email || !password || !branch_id)
            return res.status(400).json({ error: "Faltan datos" });
        const salt = yield (0, bcrypt_1.genSalt)(10);
        const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
        const user = yield prismaclient_1.default.user.create({
            data: {
                name,
                rut,
                email,
                password: hashedPassword,
                branch_id: Number(branch_id),
            },
        });
        return res.status(201).json({ message: "Usuario creado", user });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.CreateUser = CreateUser;
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, rut, email, password, branch_id } = req.body;
        if (!name || !rut || !email || !password || !branch_id)
            return res.status(400).json({ error: "Faltan datos" });
        const salt = yield (0, bcrypt_1.genSalt)(10);
        const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
        const user = yield prismaclient_1.default.user.update({
            where: { id: Number(id) },
            data: {
                name,
                rut,
                email,
                password: hashedPassword,
                branch_id: Number(branch_id),
            },
        });
        return res.status(200).json({ message: "Usuario actualizado", user });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.UpdateUser = UpdateUser;
const DeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prismaclient_1.default.user.delete({
            where: { id: Number(id) },
        });
        return res.status(200).json({ message: "Usuario eliminado", user });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.DeleteUser = DeleteUser;
