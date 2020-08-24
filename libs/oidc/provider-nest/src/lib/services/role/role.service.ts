import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Role, RoleRepo } from '../../entities/all.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo) {}

  public async insertRole(req: Request) {
    const existingRole = await this.roleRepo.findOne({
      where: {
        level: req.body.level,
        name: req.body.name
      }
    });
    if (existingRole) {
      throw new Error('Role already exists');
    } else {
      const _role: Partial<Role> = {
        level: req.body.level,
        name: req.body.name
      };
      const role = this.roleRepo.create(_role);
      return this.roleRepo.save(role);
    }
  }

  public async updateRole(req: Request) {
    const _role: Partial<Role> = {
      level: req.body.level,
      name: req.body.name
    };
    const role = this.roleRepo.create(_role);
    return this.roleRepo.save(role);
  }

  public async insertRoles(req: Request) {
    const _roles: Partial<Role>[] = [];
    req.body.roles.map((role) => {
      const newRole: Partial<Role> = {
        level: role.level,
        name: role.name
      };
      _roles.push(newRole);
    });
    const roles = this.roleRepo.create(_roles);
    return this.roleRepo.save(roles);
  }

  public async getRole(guid: string) {
    return this.roleRepo.findOne({
      where: {
        guid: guid
      }
    });
  }

  public async getAllRoles() {
    return this.roleRepo.find();
  }
}
