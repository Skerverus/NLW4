import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("Campo obrigatório"),
      email: yup.string().email().required("Email não válido")
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    }catch(err) {
      throw new AppError(err);
    }
    
    const usersRepository = getCustomRepository(UsersRepository);

    // SELECT * FROM USERS WHERE EMAIL = "EMAIL"
    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if(userAlreadyExists) {
      throw new AppError("User already exists!");
    }

    //Deve criar o repositório antes ed salvar
    const user = usersRepository.create({
      name, email
    })

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
};

export { UserController };