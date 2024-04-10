import { Controller, Get, Post, Body, Query, DefaultValuePipe, Param, Delete } from '@nestjs/common';
import { MettingRoomService } from './metting-room.service';
import { generateParseIntPipe } from 'src/utils';
import { CreateMeetingRoomDto } from './dto/create-metting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-metting-room.dto';

@Controller('metting-room')
export class MettingRoomController {
  constructor(private readonly mettingRoomService: MettingRoomService) {}

  @Get('init-data')
  initData() {
    this.mettingRoomService.initData();
  }

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe('1'), generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', new DefaultValuePipe('2'), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
  ) {
    return await this.mettingRoomService.find(pageNo, pageSize, name, capacity, equipment);
  }

  @Post('create')
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.mettingRoomService.create(meetingRoomDto);
  }

  @Post('update')
  async update(@Body() MeetingRoomDto: UpdateMeetingRoomDto) {
    return await this.mettingRoomService.update(MeetingRoomDto);
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.mettingRoomService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.mettingRoomService.delete(id);
  }
}
