import { IsNotEmpty, IsString, IsNumberString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class StatesListRequest {
    @ApiProperty({
        description: "Country ID",
    })
    @IsNumberString()
    id: number;
}
