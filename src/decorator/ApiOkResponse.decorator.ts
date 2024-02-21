import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResDataDto } from '../authentication/dto/responses/res-data.dto';

export const ApiOkResponseData = <DataDto extends Type<unknown>>(
  dataDto: DataDto | [DataDto],
) =>
  applyDecorators(
    ApiExtraModels(
      ResDataDto,
      ...(Array.isArray(dataDto) ? dataDto : [dataDto]),
    ),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResDataDto) },
          {
            properties: {
              data: Array.isArray(dataDto)
                ? {
                    type: 'array',
                    items: {
                      oneOf: dataDto.map((item) => ({
                        $ref: getSchemaPath(item),
                      })),
                    },
                  }
                : { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );
