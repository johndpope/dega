package resolvers

import (
	"context"

	"github.com/factly/dega-api/config"
	"github.com/factly/dega-api/graph/models"
	"github.com/factly/dega-api/graph/validator"
)

func (r *queryResolver) Formats(ctx context.Context) (*models.FormatsPaging, error) {
	sID, err := validator.GetSpace(ctx)
	if err != nil {
		return nil, err
	}

	result := &models.FormatsPaging{}
	result.Nodes = make([]*models.Format, 0)

	config.DB.Model(&models.Format{}).Where(&models.Format{
		SpaceID: sID,
	}).Count(&result.Total).Order("id desc").Find(&result.Nodes)

	return result, nil
}
